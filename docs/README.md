# Documentation

This directory contains comprehensive documentation for the portfolio project.

## Getting Started

### For New Users
📄 **[DEFAULT_DATA_SETUP.md](./DEFAULT_DATA_SETUP.md)**
- **START HERE** - Customize your portfolio data
- Update personal information, work experience, skills
- Single source of truth explanation
- Step-by-step customization guide
- Common customizations and best practices

## Password Protection Feature

Documentation for the password protection system implemented for edit pages:

### Setup & Usage
📄 **[PASSWORD_PROTECTION_SETUP.md](./PASSWORD_PROTECTION_SETUP.md)**
- Complete setup guide for local and production environments
- How to generate password hashes
- GitHub Secrets configuration
- Usage instructions
- Troubleshooting guide
- Security considerations

### Testing
📄 **[PASSWORD_PROTECTION_TESTS.md](./PASSWORD_PROTECTION_TESTS.md)**
- Comprehensive test suite documentation
- **125 tests total** (112 passing, 13 failing)
- **89.6% pass rate** with minor environment-related failures
- Test statistics and coverage reports
- Running instructions
- Test patterns and best practices
- Future improvement recommendations

## Quick Links

### First Time Setup
1. **[Customize Your Data](./DEFAULT_DATA_SETUP.md)** - Update personal info, experience, skills
2. **[Setup Password Protection](./PASSWORD_PROTECTION_SETUP.md)** - Secure your edit pages
3. **Build & Deploy** - See main [README.md](../README.md)

### For Developers
- **Setup Password Protection**: [PASSWORD_PROTECTION_SETUP.md](./PASSWORD_PROTECTION_SETUP.md)
- **Run Tests**: `npm test -- --testPathPatterns="password"`
- **View Test Coverage**: See [PASSWORD_PROTECTION_TESTS.md](./PASSWORD_PROTECTION_TESTS.md)
- **Update Resume Data**: See [DEFAULT_DATA_SETUP.md](./DEFAULT_DATA_SETUP.md)

### For Users
- **Access Protected Pages**: Navigate to `/resume/edit` or `/cover-letter/edit`
- **Default Password**: Configured during setup (see SETUP guide)
- **Session Duration**: 24 hours

## Project Structure

```
ismail-portfolio/
├── docs/                              # Documentation
│   ├── README.md                      # This file
│   ├── PASSWORD_PROTECTION_SETUP.md   # Setup guide
│   └── PASSWORD_PROTECTION_TESTS.md   # Test documentation
├── src/
│   ├── components/
│   │   └── auth/
│   │       ├── PasswordProtection.tsx           # Main component
│   │       └── __tests__/                       # Unit tests
│   ├── config/
│   │   ├── password.ts                          # Password config
│   │   ├── password.example.ts                  # Template
│   │   └── __tests__/                           # Config tests
│   ├── app/
│   │   ├── resume/edit/
│   │   │   ├── page.tsx                         # Protected page
│   │   │   └── __tests__/                       # Integration tests
│   │   └── cover-letter/edit/
│   │       ├── page.tsx                         # Protected page
│   │       └── __tests__/                       # Integration tests
│   └── __tests__/
│       └── password-protection-e2e.test.tsx     # E2E tests
└── scripts/
    └── generate-password-hash.js                # Hash generator
```

## Additional Resources

- **Main README**: See project root for general setup
- **CLAUDE.md**: Project architecture and development guidelines
- **GitHub Issues**: Report bugs or request features

## Contributing

When adding new features that require documentation:

1. Create a new `.md` file in this directory
2. Update this README with a link to your documentation
3. Follow the same structure as existing docs:
   - Clear headings and sections
   - Code examples
   - Troubleshooting section
   - Usage instructions

## Support

For questions or issues:
- Check the relevant documentation first
- Look at the troubleshooting sections
- Check GitHub Issues for similar problems
- Create a new issue with detailed information
