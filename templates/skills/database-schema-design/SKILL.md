---
name: database-schema-design
description: "Use when designing database schemas, creating migrations, modeling data relationships, optimizing database queries, adding indexes, or selecting between SQL and NoSQL storage"
---

# Database Schema Design

## Purpose

Guide the design, implementation, and optimization of database schemas with sound data modeling, safe migrations, effective indexing, and appropriate query patterns.

## When to Use

- Designing a new database schema or data model
- Creating or modifying database migrations
- Adding or optimizing indexes
- Modeling complex entity relationships
- Optimizing slow database queries
- Choosing between storage solutions

## Data Modeling Methodology

### Conceptual Model

Define entities and their relationships in plain language before touching SQL.

1. Identify entities (nouns: User, Order, Product)
2. Identify relationships (verbs: User places Order, Order contains Product)
3. Identify attributes (properties: User has email, name, created_at)
4. Identify cardinality (one-to-many, many-to-many)

### Logical Model

Translate the conceptual model into tables, columns, types, and constraints.

| Decision | Guidance |
|----------|----------|
| Primary keys | Use UUIDs for distributed systems, auto-increment for single-node |
| Column types | Use the most specific type (e.g., `timestamptz` not `varchar` for dates) |
| Nullability | Default NOT NULL; allow NULL only when absence is meaningful |
| Defaults | Set sensible defaults (e.g., `created_at DEFAULT now()`) |
| Constraints | Add CHECK, UNIQUE, and FK constraints at the schema level |

### Physical Model

Optimize for actual query patterns and data volumes.

- Add indexes based on measured query patterns (not speculation)
- Partition large tables by time or tenant
- Choose storage engine settings appropriate to workload
- Plan for data growth over 1-3 years

## Normalization Guide

### First Normal Form (1NF)

Every column contains atomic values. No repeating groups.

```sql
-- Bad: repeating groups
CREATE TABLE orders (
  id INT, tags VARCHAR(255)  -- "urgent,priority,vip"
);

-- Good: atomic values
CREATE TABLE order_tags (
  order_id INT REFERENCES orders(id),
  tag VARCHAR(50),
  PRIMARY KEY (order_id, tag)
);
```

### Second Normal Form (2NF)

All non-key columns depend on the entire primary key (relevant for composite keys).

```sql
-- Bad: partial dependency (product_name depends only on product_id)
CREATE TABLE order_items (
  order_id INT, product_id INT, product_name VARCHAR(255), quantity INT,
  PRIMARY KEY (order_id, product_id)
);

-- Good: product_name lives in products table
CREATE TABLE order_items (
  order_id INT, product_id INT REFERENCES products(id), quantity INT,
  PRIMARY KEY (order_id, product_id)
);
```

### Third Normal Form (3NF)

No non-key column depends on another non-key column (no transitive dependencies).

```sql
-- Bad: city depends on zip_code, not on user_id
CREATE TABLE users (
  id INT PRIMARY KEY, zip_code VARCHAR(10), city VARCHAR(100)
);

-- Good: city derived from zip_code table
CREATE TABLE users (id INT PRIMARY KEY, zip_code VARCHAR(10) REFERENCES zip_codes(code));
CREATE TABLE zip_codes (code VARCHAR(10) PRIMARY KEY, city VARCHAR(100));
```

### When to Denormalize

| Scenario | Pattern |
|----------|---------|
| Read-heavy dashboards | Materialized views or summary tables |
| Frequently joined data | Embed as JSONB column |
| Reporting / analytics | Separate denormalized reporting tables |
| Caching layer | Computed columns refreshed on write |

Always start normalized. Denormalize only when you have measured evidence of a performance problem.

## Migration Strategy

### Zero-Downtime Migrations (Expand-Contract)

Never make a breaking change in a single migration. Use two phases:

**Expand phase** (backward compatible):
1. Add new column/table (nullable or with default)
2. Deploy code that writes to both old and new
3. Backfill existing data
4. Deploy code that reads from new

**Contract phase** (after all code uses new schema):
1. Remove code that writes to old
2. Drop old column/table

### Rollback Plans

Every migration must have a corresponding rollback:

```sql
-- Migration: up
ALTER TABLE users ADD COLUMN display_name VARCHAR(255);

-- Migration: down
ALTER TABLE users DROP COLUMN display_name;
```

Rules:
- Test rollback in staging before applying to production
- Data-destructive rollbacks (dropping columns with data) need explicit approval
- Keep migration files immutable once applied

### Data Backfill Patterns

For large tables, backfill in batches to avoid locking:

```sql
-- Backfill in chunks of 1000
UPDATE users SET display_name = username
WHERE display_name IS NULL
AND id IN (SELECT id FROM users WHERE display_name IS NULL LIMIT 1000);
```

## Indexing Patterns

### B-tree Indexes (Default)

Best for equality and range queries:

```sql
-- Equality
CREATE INDEX idx_users_email ON users(email);

-- Range
CREATE INDEX idx_orders_created ON orders(created_at);
```

### GIN Indexes

Best for full-text search, JSONB, and array columns:

```sql
-- Full-text search
CREATE INDEX idx_posts_search ON posts USING GIN(to_tsvector('english', body));

-- JSONB containment
CREATE INDEX idx_events_metadata ON events USING GIN(metadata);

-- Array contains
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);
```

### Partial Indexes

Index only rows matching a condition (smaller, faster):

```sql
-- Only index active users
CREATE INDEX idx_active_users_email ON users(email) WHERE active = true;

-- Only index unprocessed orders
CREATE INDEX idx_unprocessed_orders ON orders(created_at) WHERE status = 'pending';
```

### Covering Indexes (INCLUDE)

Include non-key columns to enable index-only scans:

```sql
-- Include name so queries filtering by email and selecting name avoid table lookups
CREATE INDEX idx_users_email ON users(email) INCLUDE (name);
```

### Composite Indexes

Column order matters. The index is usable for queries on:
- First column alone
- First + second columns
- First + second + third columns
- NOT second column alone

```sql
-- Supports: WHERE tenant_id = X, WHERE tenant_id = X AND status = Y
-- Does NOT efficiently support: WHERE status = Y alone
CREATE INDEX idx_orders_tenant_status ON orders(tenant_id, status);
```

Rule: place high-cardinality equality columns first, range columns last.

## Query Optimization

### EXPLAIN ANALYZE Reading

```sql
EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 123;
```

Key things to look for:
- **Seq Scan** on large tables (missing index)
- **Nested Loop** with large outer table (may need index or restructure)
- **Hash Join** memory usage (work_mem may need tuning)
- **Actual rows** vs **estimated rows** (stale statistics if far off)

### N+1 Detection and Prevention

```sql
-- N+1: one query per user's orders (bad)
SELECT * FROM users;
-- Then for EACH user: SELECT * FROM orders WHERE user_id = ?;

-- Fixed: single join or subquery
SELECT u.*, o.* FROM users u
LEFT JOIN orders o ON o.user_id = u.id;

-- Or batch load
SELECT * FROM orders WHERE user_id = ANY($1);
```

### Connection Pooling

Use a connection pooler (PgBouncer, built-in pool) to avoid exhausting database connections:
- Application servers should not open raw connections
- Set pool size based on: `connections = (CPU cores * 2) + disk spindles`
- Use transaction-level pooling for most workloads

## Relationship Patterns

### One-to-One

```sql
-- Profile extends User (separate table for rarely-accessed data)
CREATE TABLE user_profiles (
  user_id INT PRIMARY KEY REFERENCES users(id),
  bio TEXT,
  avatar_url VARCHAR(500)
);
```

### One-to-Many

```sql
-- A user has many orders
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  total DECIMAL(10,2)
);
CREATE INDEX idx_orders_user ON orders(user_id);
```

### Many-to-Many

```sql
-- Students enroll in courses
CREATE TABLE enrollments (
  student_id INT REFERENCES students(id),
  course_id INT REFERENCES courses(id),
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (student_id, course_id)
);
```

### Polymorphic Associations

```sql
-- Comments can belong to posts, videos, or photos
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  commentable_type VARCHAR(50) NOT NULL, -- 'post', 'video', 'photo'
  commentable_id INT NOT NULL,
  body TEXT NOT NULL
);
CREATE INDEX idx_comments_target ON comments(commentable_type, commentable_id);
```

Alternative (preferred): use separate foreign key columns with a CHECK constraint ensuring exactly one is set.

### Self-Referential (Trees)

```sql
-- Category tree using adjacency list
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  parent_id INT REFERENCES categories(id),
  name VARCHAR(255) NOT NULL
);

-- For efficient tree queries, consider materialized path or ltree:
ALTER TABLE categories ADD COLUMN path LTREE;
CREATE INDEX idx_categories_path ON categories USING GIST(path);
```

## ORM Guidance

| ORM | Language | Strength | Watch Out For |
|-----|----------|----------|---------------|
| **Prisma** | TypeScript | Type-safe schema, migrations | N+1 in nested queries, limited raw SQL |
| **Drizzle** | TypeScript | SQL-like API, lightweight | Newer ecosystem, fewer guides |
| **SQLAlchemy** | Python | Mature, flexible, raw SQL support | Complex session management |
| **GORM** | Go | Convention-based, auto-migrate | Silent failures, implicit behavior |

### ORM Best Practices

- Always review generated SQL (enable query logging in development)
- Use eager loading to prevent N+1 queries
- Write raw SQL for complex queries rather than fighting the ORM
- Use migrations from the ORM, not auto-sync in production
- Test query performance with realistic data volumes, not empty databases
