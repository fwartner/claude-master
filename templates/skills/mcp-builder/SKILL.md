---
name: mcp-builder
description: Use when building MCP (Model Context Protocol) servers including tool definitions, resources, prompts, transport configuration, and security hardening.
---

# MCP Builder

## Overview
Guides the development of MCP (Model Context Protocol) servers that expose tools, resources, and prompts to AI assistants. Covers the full lifecycle from tool definition through transport configuration, error handling, testing, and security hardening.

## Process

### 1. Server Architecture Design
- [ ] Identify capabilities to expose:
  - **Tools**: Actions the AI can invoke (create, update, delete, query)
  - **Resources**: Data the AI can read (files, database records, API responses)
  - **Prompts**: Reusable prompt templates the AI can use
- [ ] Choose transport mechanism:
  - **stdio**: For local CLI tools (default, simplest)
  - **SSE (Server-Sent Events)**: For remote/web-based servers
  - **Streamable HTTP**: For modern HTTP-based transport
- [ ] Define the dependency and authentication requirements
- [ ] Plan the directory structure:
  ```
  mcp-server/
    src/
      index.ts          # Server entry point
      tools/            # Tool definitions and handlers
      resources/        # Resource definitions and handlers
      prompts/          # Prompt templates
      utils/            # Shared utilities
      types.ts          # TypeScript type definitions
    tests/
      tools/
      resources/
    package.json
    tsconfig.json
  ```

### 2. Tool Definitions
- [ ] Define each tool with precise schema:
  ```typescript
  server.tool(
    "create-issue",
    "Create a new issue in the project tracker",
    {
      title: z.string().describe("Issue title, concise and descriptive"),
      body: z.string().describe("Detailed description of the issue"),
      labels: z.array(z.string()).optional().describe("Labels to apply"),
      priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
      assignee: z.string().optional().describe("Username to assign"),
    },
    async ({ title, body, labels, priority, assignee }) => {
      const issue = await issueTracker.create({ title, body, labels, priority, assignee });
      return {
        content: [{ type: "text", text: `Created issue #${issue.id}: ${issue.url}` }],
      };
    }
  );
  ```
- [ ] Every parameter must have a `.describe()` annotation
- [ ] Use Zod schemas for input validation
- [ ] Return structured content (text, images, or embedded resources)
- [ ] Handle errors gracefully with `isError: true` responses

### 3. Resource Definitions
- [ ] Define static and dynamic resources:
  ```typescript
  // Static resource
  server.resource(
    "project-config",
    "config://project",
    "Project configuration and settings",
    async () => ({
      contents: [{
        uri: "config://project",
        mimeType: "application/json",
        text: JSON.stringify(await loadProjectConfig()),
      }],
    })
  );

  // Dynamic resource with template
  server.resource(
    "issue-detail",
    new ResourceTemplate("issues://{issueId}", "Issue details by ID"),
    async (uri, { issueId }) => ({
      contents: [{
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify(await getIssue(issueId)),
      }],
    })
  );
  ```
- [ ] Use appropriate MIME types
- [ ] Implement resource list for discovery
- [ ] Support subscription for resources that change

### 4. Prompt Definitions
- [ ] Define reusable prompt templates:
  ```typescript
  server.prompt(
    "code-review",
    "Generate a structured code review",
    {
      language: z.string().describe("Programming language"),
      code: z.string().describe("Code to review"),
      focus: z.enum(["security", "performance", "readability", "all"]).default("all"),
    },
    ({ language, code, focus }) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `Review this ${language} code with focus on ${focus}:\n\n\`\`\`${language}\n${code}\n\`\`\``,
        },
      }],
    })
  );
  ```

### 5. Error Handling
- [ ] Categorize errors by recoverability:
  ```typescript
  // User-facing error (bad input, not found)
  return {
    content: [{ type: "text", text: `Issue #${id} not found` }],
    isError: true,
  };

  // Internal error (service down, unexpected)
  try {
    const result = await riskyOperation();
    return { content: [{ type: "text", text: result }] };
  } catch (error) {
    console.error("Operation failed:", error);
    return {
      content: [{ type: "text", text: `Operation failed: ${error.message}. Please try again.` }],
      isError: true,
    };
  }
  ```
- [ ] Never expose stack traces or internal details to the client
- [ ] Log errors server-side with full context
- [ ] Return actionable error messages

### 6. Transport Configuration
- [ ] **stdio transport** (local):
  ```typescript
  import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
  const transport = new StdioServerTransport();
  await server.connect(transport);
  ```
- [ ] **SSE transport** (remote):
  ```typescript
  import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
  app.get("/sse", async (req, res) => {
    const transport = new SSEServerTransport("/message", res);
    await server.connect(transport);
  });
  app.post("/message", async (req, res) => {
    await transport.handlePostMessage(req, res);
  });
  ```
- [ ] Configure appropriate timeouts
- [ ] Handle connection lifecycle (connect, disconnect, reconnect)

### 7. Testing Strategy
- [ ] Unit test each tool handler independently:
  ```typescript
  describe("create-issue tool", () => {
    it("creates issue with valid input", async () => {
      const result = await handler({ title: "Bug", body: "Description", priority: "high" });
      expect(result.content[0].text).toContain("Created issue #");
      expect(result.isError).toBeUndefined();
    });

    it("returns error for missing required fields", async () => {
      await expect(handler({})).rejects.toThrow();
    });
  });
  ```
- [ ] Integration test with MCP client:
  ```typescript
  const client = new Client({ name: "test", version: "1.0" });
  const transport = new StdioClientTransport({ command: "node", args: ["dist/index.js"] });
  await client.connect(transport);
  const result = await client.callTool("create-issue", { title: "Test", body: "Body" });
  ```
- [ ] Test error paths and edge cases
- [ ] Test resource listing and reading
- [ ] Validate schema compliance

### 8. Security Hardening
- [ ] Validate all inputs with Zod (never trust client data)
- [ ] Sanitize outputs (no SQL injection, XSS, path traversal)
- [ ] Implement rate limiting for expensive operations
- [ ] Use environment variables for secrets (never hardcode)
- [ ] Limit file system access to allowed directories
- [ ] Log all tool invocations for audit trail
- [ ] Implement authentication for remote transports
- [ ] Restrict tool capabilities to minimum required permissions

## Key Principles
1. **Descriptive schemas** - Every tool, parameter, and resource must have clear descriptions. The AI uses these to decide when and how to invoke tools.
2. **Fail gracefully** - Return `isError: true` with helpful messages rather than throwing unhandled exceptions.
3. **Principle of least privilege** - Tools should have the minimum permissions needed. Do not expose broad capabilities.
4. **Idempotent where possible** - Tools that can be safely retried are more robust in AI agent loops.
5. **Test with real clients** - Unit tests are insufficient. Test the full MCP protocol flow.
6. **Version your server** - Use semantic versioning. Breaking changes to tool schemas require major version bumps.

## Skill Type
Rigid
