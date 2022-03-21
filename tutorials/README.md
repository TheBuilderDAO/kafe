# Writing a tutorial

By running `yarn install` in the root of the project you should have a BuilderDAO CLI available

## Initializing tutorial

In order to initialize tutorial run

```bash
builderdao tutorial init
```

You will be prompted with few questions about your tutorial. After you are done you will have a boilerplate to start writing your tutorial.
A new folder will be created for your tutorial. Name of the folder is the same as the tutorial slug.
Inside of this folder you will find:
- `content` - folder with tutorial markdown files
- builderdao.config.json - file with tutorial metadata
- builderdao.lock.json - file with tutorial configuration. THIS FILE SHOULD NOT BE MODIFIED MANUALLY

## Publishing

Once you are done writing your tutorial, commit your changes, push your tutorial branch to GitHub and create a PR.
After 2 assigned reviewers approve your tutorial and merge it in, your tutorial will be automatically published.
