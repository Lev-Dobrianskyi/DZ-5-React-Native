# Code Editing Rules

## Editing Boundaries
- Edit ONLY the active file or the files attached to the chat (#file). Do not modify, create, or delete any other files without explicit permission.
- Make the minimal changes necessary, and only what was explicitly requested.
- Do not add anything "while you're at it": no refactoring, renaming, reformatting, optimizations, new dependencies, comments, or tests unless they were requested.
- Do not guess or assume the desired behavior. If something is ambiguous, ask a clarifying question.
- Do not change existing logic. The only exception is when the logic directly causes the error that needs to be fixed. In that case, explain exactly what you are changing and why.
- Preserve the existing code style, naming conventions, indentation, and formatting.

## Required Workflow (before making any changes)
1. Analyze the active/attached file and the code relevant to the request.
2. Determine exactly what needs to change and estimate the scope (files, methods, approximate number of lines).
3. Consider multiple approaches and choose the one closest to the already implemented logic and the project's style.
4. Present the user with a short plan: which files and code fragments will be changed, which approach was chosen, and why.
5. If changes are required outside the active/attached file, stop and ask for confirmation. Proceed only after explicit approval.
6. Apply changes only after confirmation, and only the planned ones.

## After Making Changes
- Briefly list what was changed and where.
- Separately list anything you noticed but did NOT change (potential issues, possible improvements), without applying them.