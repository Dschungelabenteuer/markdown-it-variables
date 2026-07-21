# markdown-it-variables

## 2.0.1

### Patch Changes

- dcdd545: Fixed package exports

## 2.0.0

### Major Changes

- dbda7ff: - Added new `ucfirst` modifier that capitalizes the first letter of a variable, aliased as `^`.

  - A distinction is now made between simple and rich modifiers where rich modifiers can only be applied to rich variables and simple modifiers can be applied to both simple and rich variables.

  #### Breaking changes

  Because of the new distinction between simple and rich modifiers, modifiers can now be applied to simple variables as long as they're not rich modifiers. Previously, it would throw with `UnexpectedModifierError`, it now only throws with `UnexpectedRichModifierError` when a rich modifier is applied to a simple variable.

## 1.1.1

### Patch Changes

- 697385a: Added the ability to wrap variables output in spans with custom class name

## 1.1.0

### Minor Changes

- 66418ab: The plugin now throws an explicit error when no variables were set

## 1.0.2

### Patch Changes

- 62bde2c: Export PluginOptions type

## 1.0.1

### Patch Changes

- a168d5e: Fixed exported types path
