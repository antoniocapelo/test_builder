# Development notes

This file is intended to collect some thoughts and ideas that I have during the implementation of the feature. It will serve as a sanity check for some things I want to do — think of it like a dev journal.


## UI/UX improvements

- [x] Progress bar when viewing survey
- [x] Fix broken toasts
- [x] Add an Error summary section on survey form
- [x] Add loading indicator
- [x] Success toast with link to new survey
- [x] Table view for Homepage

## Missing UI states or features
- [x] Survey form field validation
- [x] Survey creation field validation
- [x] Move zod validation to hook
- [x] Add optional indicator instead of asterisk
- [x] Home page - no state for empty surveys list
- [x] Switch between edit/preview modes
- [x] search functionality
- [ ] Consistent back navigation

## Possible improvements to base logic

- [ ] lib/survey always reads from LS - we could cache this value for read purposes (P2)
- [x] unify create/edit form as it uses 90% of the same code


## Caveats
- "Error summary" focus does not work as I'd like in all major browsers
- Error handling UX could be better (parsing json, not found, etc)