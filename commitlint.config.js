export default {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            [
                'feat',     // New feature
                'fix',      // Bug fix
                'docs',     // Documentation only
                'style',    // Formatting, missing semi colons, etc
                'refactor', // Code change that neither fixes a bug nor adds a feature
                'perf',     // Code change that improves performance
                'test',     // Adding missing tests or correcting existing tests
                'build',    // Changes that affect the build system or external dependencies
                'ci',       // Changes to our CI configuration files and scripts
                'chore',    // Other changes that don't modify src or test files
                'revert'    // Reverts a previous commit
            ]
        ]
    }
};
