---
name: mobile-design
description: When the user needs mobile app design and development patterns for React Native, Flutter, or SwiftUI — including platform HIG compliance, gestures, and offline-first architecture.
---

# Mobile Design

## Overview

Design and build mobile applications that feel native on each platform. This skill covers React Native, Flutter, and SwiftUI with deep knowledge of platform-specific Human Interface Guidelines (Apple HIG) and Material Design, gesture handling, responsive layouts, offline-first patterns, and app store submission requirements.

## Process

### Phase 1: Platform Analysis
1. Identify target platforms (iOS, Android, both)
2. Choose framework (React Native, Flutter, SwiftUI, or cross-platform)
3. Review platform-specific design guidelines
4. Define navigation architecture
5. Map offline requirements

### Phase 2: Design Implementation
1. Build component library with platform variants
2. Implement navigation (tab bar, stack, drawer)
3. Handle safe areas and notches
4. Add gesture recognizers
5. Implement responsive layouts for phone/tablet

### Phase 3: Platform Polish
1. Platform-specific animations and transitions
2. Haptic feedback integration
3. App icon and launch screen
4. Dark mode and Dynamic Type support
5. App store metadata and screenshots

## Platform-Specific HIG Compliance

### Apple Human Interface Guidelines
- **Navigation**: Use UINavigationController patterns (push/pop), tab bars at bottom (max 5 items)
- **Typography**: Use SF Pro / SF Pro Rounded, support Dynamic Type (all 11 sizes)
- **Safe Areas**: Respect `safeAreaInsets` — never place content under notch/home indicator
- **Gestures**: Swipe-back for navigation, long press for context menus
- **Haptics**: Use UIFeedbackGenerator (impact, selection, notification)
- **Colors**: Use semantic system colors (`label`, `secondaryLabel`, `systemBackground`)
- **Modals**: Use sheets (`.sheet`, `.fullScreenCover`) with drag-to-dismiss
- **Lists**: Use grouped inset style for settings, plain for content feeds
- **Icons**: SF Symbols library (5000+ icons, variable weight/size)

### Material Design (Android)
- **Navigation**: Bottom navigation bar, navigation drawer, top app bar
- **Typography**: Roboto / product font, Material type scale (display/headline/title/body/label)
- **Edge-to-edge**: Draw behind system bars, handle window insets
- **Gestures**: Predictive back gesture (Android 14+), swipe-to-dismiss
- **Haptics**: HapticFeedbackConstants (click, long press, keyboard)
- **Colors**: Material You dynamic color from wallpaper, tonal palettes
- **Components**: FAB, snackbar, bottom sheet, chips
- **Motion**: Shared element transitions, container transform

### Cross-Platform Considerations
```
| Feature         | iOS Pattern          | Android Pattern        |
|-----------------|----------------------|------------------------|
| Back navigation | Swipe from left edge | System back button     |
| Primary action  | Right nav bar button | FAB                    |
| Alerts          | UIAlertController    | MaterialAlertDialog    |
| Loading         | UIActivityIndicator  | CircularProgressIndicator |
| Segmented       | UISegmentedControl   | Tabs / Chips           |
| Date picker     | Wheel picker         | Calendar picker        |
```

## Safe Area Handling

### React Native
```jsx
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

function Screen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      {/* Content */}
    </View>
  );
}
```

### Flutter
```dart
Widget build(BuildContext context) {
  return Scaffold(
    body: SafeArea(
      child: // Content
    ),
  );
}
```

### SwiftUI
```swift
var body: some View {
  VStack {
    // Content automatically respects safe areas
  }
  .ignoresSafeArea(.keyboard) // Only ignore keyboard if needed
}
```

## Gesture Navigation Patterns

### Common Gestures
| Gesture | Usage | Min Target |
|---|---|---|
| Tap | Primary action | 44x44pt |
| Long press | Context menu / secondary action | 44x44pt |
| Swipe horizontal | Navigation, dismiss, reveal actions | Full row |
| Swipe vertical | Scroll, pull-to-refresh, dismiss sheet | Full area |
| Pinch | Zoom images/maps | Content area |
| Pan/Drag | Reorder, move elements | Drag handle |

### Touch Target Rules
- Minimum 44x44pt (iOS) / 48x48dp (Android)
- Minimum 8pt spacing between targets
- Visual element can be smaller than touch target (use padding)
- Thumb zone: bottom 1/3 of screen for primary actions

## Responsive Layouts

### Adaptive Layout Strategy
```
Phone Portrait:    Single column, bottom tabs
Phone Landscape:   Single column or split, side tabs
Tablet Portrait:   Two columns, sidebar
Tablet Landscape:  Three columns, persistent sidebar
```

### React Native Responsive
```javascript
import { useWindowDimensions } from 'react-native';

function useResponsive() {
  const { width } = useWindowDimensions();
  return {
    isPhone: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
    columns: width < 768 ? 1 : width < 1024 ? 2 : 3,
  };
}
```

### Flutter Responsive
```dart
class ResponsiveLayout extends StatelessWidget {
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        if (constraints.maxWidth < 600) return MobileLayout();
        if (constraints.maxWidth < 1200) return TabletLayout();
        return DesktopLayout();
      },
    );
  }
}
```

## Offline-First Patterns

### Architecture
1. **Local-first data**: SQLite/Realm as primary store, server as sync target
2. **Optimistic updates**: Apply changes locally, sync in background
3. **Conflict resolution**: Last-write-wins or field-level merge
4. **Queue management**: Persist pending operations, retry on connectivity
5. **Cache strategy**: Stale-while-revalidate for API data

### Implementation Checklist
- [ ] Network status detection and UI indicator
- [ ] Local database for all critical data
- [ ] Operation queue for pending writes
- [ ] Retry logic with exponential backoff
- [ ] Conflict detection and resolution strategy
- [ ] Cache invalidation policy
- [ ] Sync status indicator in UI
- [ ] Graceful degradation for features requiring network

## App Store Guidelines Summary

### Apple App Store
- Screenshots: 6.7" and 5.5" required, 12.9" for iPad
- App icon: 1024x1024px, no alpha, no rounded corners (system applies)
- Privacy nutrition labels: declare all data collection
- Review time: typically 24-48 hours
- Rejection triggers: crashes on launch, placeholder content, undisclosed APIs

### Google Play Store
- Screenshots: minimum 2, maximum 8 per device type
- Feature graphic: 1024x500px required
- App icon: 512x512px, adaptive icon recommended
- Content rating questionnaire: required
- Data safety section: declare data collection and sharing

## Performance Targets

| Metric | Target |
|---|---|
| Cold start | < 2 seconds |
| Screen transition | < 300ms |
| Touch response | < 100ms |
| Scroll FPS | 60fps (no drops) |
| Memory usage | < 200MB baseline |
| App size | < 50MB download |

## Anti-Patterns

- Using web patterns in mobile (hover states, tiny buttons, horizontal scroll)
- Ignoring platform conventions (iOS-styled buttons on Android)
- Fixed layouts that break on different screen sizes
- Blocking main thread with network/database operations
- Not handling keyboard appearance (content hidden behind keyboard)
- Assuming constant network connectivity
- Skipping haptic feedback for important interactions
- Using pixel values instead of density-independent points

## Skill Type

**FLEXIBLE** — Adapt patterns to the chosen framework and target platforms. Platform-specific guidelines should be followed when targeting a single platform; cross-platform apps may blend conventions thoughtfully.
