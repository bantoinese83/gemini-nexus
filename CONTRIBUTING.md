# Contributing to Gemini Nexus

First off, thank you for considering contributing to Gemini Nexus! It's people like you that make it such a great tool for everyone.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct, which asks that you treat all people with respect and kindness.

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

- Use the GitHub issue search — check if the issue has already been reported.
- Check if the issue has been fixed — try to reproduce it using the latest main branch in the repository.
- Isolate the problem — create a reduced test case and a live example.

#### How Do I Submit A Good Bug Report?

Bugs are tracked as GitHub issues. Create an issue and provide the following information:

- Use a clear and descriptive title for the issue to identify the problem.
- Describe the exact steps which reproduce the problem in as many details as possible.
- Provide specific examples to demonstrate the steps.
- Describe the behavior you observed after following the steps and point out what exactly is the problem with that behavior.
- Explain which behavior you expected to see instead and why.
- Include screenshots or animated GIFs which show you following the described steps and clearly demonstrate the problem.
- If the problem is related to performance or memory, include a CPU profile capture with your report.
- If the console shows any errors, include those in the bug report.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion, including completely new features and minor improvements to existing functionality.

- Use a clear and descriptive title for the issue to identify the suggestion.
- Provide a step-by-step description of the suggested enhancement in as many details as possible.
- Provide specific examples to demonstrate the steps or point out the part of Gemini Nexus which the suggestion relates to.
- Describe the current behavior and explain which behavior you expected to see instead and why.
- Explain why this enhancement would be useful to most Gemini Nexus users.
- List some other similar implementations or applications where this enhancement exists.

### Pull Requests

- Fill in the required template
- Do not include issue numbers in the PR title
- Include screenshots and animated GIFs in your pull request whenever possible
- Follow the TypeScript styleguide
- Include thoughtfully-worded, well-structured Jest tests
- Document new code with comprehensive comments
- End all files with a newline
- Avoid platform-dependent code

## Development Workflow

### Setting up the Development Environment

1. Fork the repo
2. Clone your fork
3. Install dependencies: `npm install`
4. Build the project: `npm run build`
5. Run tests: `npm test`

### Adding New Features

1. Create a new branch: `git checkout -b feature/your-feature-name`
2. Implement your feature or bug fix
3. Add or update tests as necessary
4. Make sure all tests pass: `npm test`
5. Build the project: `npm run build`
6. Commit your changes using a descriptive commit message
7. Push to the branch: `git push origin feature/your-feature-name`
8. Submit a pull request

### Style Guidelines

#### TypeScript

- Use 2 spaces for indentation
- Include JSDoc comments for all public APIs
- Follow the existing coding style and patterns
- Keep lines under 100 characters
- Use meaningful variable names

#### Testing

- Write tests for all new features and bug fixes
- Aim for 80% or higher code coverage
- Include both unit and integration tests as appropriate
- Follow the AAA (Arrange, Act, Assert) pattern for test structure

## Additional Notes

### Issue and Pull Request Labels

This section lists the labels we use to help us track and manage issues and pull requests.

* `bug` - Issues that are bugs
* `enhancement` - Issues that are feature requests
* `documentation` - Issues or PRs related to documentation
* `good first issue` - Good for newcomers
* `help wanted` - Extra attention is needed
* `question` - Further information is requested

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License. 