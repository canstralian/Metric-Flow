# Contributing to Metric-Flow

Thank you for your interest in contributing to Metric-Flow! This document provides guidelines for contributing to the project.

## Getting Started

1. **Open an issue first**: Before working on a significant change, please open an issue to discuss your proposed changes. This helps avoid duplicate work and ensures alignment with project goals.

2. **Fork the repository**: Create a fork of the repository to your GitHub account.

3. **Clone and setup**: 
   ```bash
   git clone https://github.com/YOUR_USERNAME/Metric-Flow.git
   cd Metric-Flow
   npm install
   ```

4. **Create a branch**: Create a feature branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type check
npm run check

# Build
npm run build
```

### Code Standards

- **TypeScript**: All code must be written in TypeScript with proper types
- **Formatting**: Code is automatically formatted with Prettier
- **Linting**: Follow ESLint rules (run `npm run lint` if configured)
- **Shared Types**: Place types used by both client and server in `shared/`
- **Error Handling**: Follow the standards defined in `docs/standards.md`

### Commit Messages

Write clear, concise commit messages:
- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests when relevant

Examples:
```
Add WebSocket reconnection logic (#42)
Fix metric validation for negative values
Update README with deployment instructions
```

## Pull Request Process

1. **Update documentation**: If your changes affect usage, update the README or docs
2. **Test your changes**: Ensure the build succeeds and functionality works
3. **Update CHANGELOG**: Add your changes to the `[Unreleased]` section
4. **Create PR**: Submit a pull request with a clear description
5. **Address feedback**: Respond to review comments promptly

### Pull Request Template

When creating a PR, include:
- **What changed**: Brief description of changes
- **Why**: Problem being solved or feature being added
- **How tested**: Steps to verify the changes work
- **Related issues**: Link to related issues

## Code Review

All submissions require review. We use GitHub pull requests for this purpose.

Reviewers will check for:
- Code quality and TypeScript usage
- Adherence to project standards
- Test coverage (when applicable)
- Documentation updates
- Security implications

## What We're Looking For

We especially welcome contributions in these areas:
- Bug fixes
- Documentation improvements
- Test coverage
- Performance optimizations
- Security enhancements

## What We're NOT Looking For

To maintain focus, we're not currently accepting:
- Major architectural changes without prior discussion
- Features outside the project's scope (see Non-goals in README)
- Dependencies that significantly increase bundle size
- Breaking changes without strong justification

## Questions?

- Open an issue for questions about contributing
- Review existing issues for ongoing discussions
- Check the README for project scope and goals

## Code of Conduct

Be respectful and constructive in all interactions. We're building something useful together.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
