# @lucidcms/core

## v0.5.0-alpha.2

### Features:

- Bricks and Custom Fields now support locales on labels in config, so optionally users can provide translations for the users selected locale. ([f9d5e5a](https://github.com/ProtoDigitalUK/lucid/commit/f9d5e5aadfaf76fcadb909299dc4dac91351fe4b))

### Breaking changes:

- Custom fields config changed for FieldBuilder and subsequently BrickBuilder and CollectionBuilder. ([786e74a](https://github.com/ProtoDigitalUK/lucid/commit/786e74a0f0224d43c77f6caf61e35f4e1835afaf))

## v0.5.0-alpha.1

### Bug Fixes:

- Fixed bug where field translation values where still being set on front and backend despite collections having translation set to false. ([16f1ada](https://github.com/ProtoDigitalUK/lucid/commit/16f1ada06799eb0c8e906bb1983af01c8f650c61))
- Fixed bug in flatten fields function on backend that was dropping fields that do not have translations enabled and where the value is empty. ([449ab1d](https://github.com/ProtoDigitalUK/lucid/commit/449ab1d7915b43447c6e2821ef2063f56de5f56e))
- Fixed issue with link select modal not clearing previously opened link on close. ([6b190a8](https://github.com/ProtoDigitalUK/lucid/commit/6b190a882dd315c31426745aa558772408247ef0))
- Fixed document row and get field/meta helpers to use param collection translation value or brick store collection translation value. ([dfea7a0c](https://github.com/ProtoDigitalUK/lucid/commit/dfea7a0c960b7159640768a9a5152308b1978af9))
- Fixed issue with document builder when in create mode where collection refetch on tab switch would reset field data. ([3787ce3](https://github.com/ProtoDigitalUK/lucid/commit/3787ce324a39b89fcd2be485978b0acfbe0d2140))

## v0.5.0-alpha.0

### Features:

- Finished the MVP of the document builder page so documents can be created, deleted and updated. Bricks and fields can be edited, removed and re-ordered etc.
- Supported locales are now listed on the settings page ([092140e](https://github.com/ProtoDigitalUK/lucid/commit/092140ec929200e35dae9bc6b13af615dd135c7b))
- Translations are now controllable on a per field basis for better granularity in setting up bricks and collections. ([43c4f90](https://github.com/ProtoDigitalUK/lucid/commit/43c4f90b8f32e69bcf43a40e70e9f520ce493aa8))
- Bricks can now have a description set against them in config ([848e9cc](https://github.com/ProtoDigitalUK/lucid/commit/848e9cc0fa8ebe711b9f7712c6b6f39526b2a342))
- Document builder now has a image preview icon that opens a modal on bricks that have preview images set. ([d2a4fc3](https://github.com/ProtoDigitalUK/lucid/commit/d2a4fc357425eb2369d91d88db8c7ce3986899c1))
- Added internationalisation support to the CMS frontend though we currently only have en translations ([ebe94e3](https://github.com/ProtoDigitalUK/lucid/commit/ebe94e3a6f577d3b1a5b12991316eb72eb8897da))
- Collections, documents, media, roles and users now all have a no data state that prompts users to create an entry. ([76bed15](https://github.com/ProtoDigitalUK/lucid/commit/76bed15881017cb9fb968021f809233a74fce06d))
- New account page added for users to control their locale preference and update their details. ([c3e4e8f](https://github.com/ProtoDigitalUK/lucid/commit/c3e4e8ff008c05d30703d03aed4c51387abcecc8))
- Creating a user no longer requires a password to be set against them, instead we utilise the password reset flow so new users can set their own password. ([b262176](https://github.com/ProtoDigitalUK/lucid/commit/b262176fb130da2a01c0ca569f1155fdc88a45b1))
- Users can now update their own password on the account route and added support to force accounts to update their password before being able to use the CMS. ([d10572f](https://github.com/ProtoDigitalUK/lucid/commit/d10572f12ae8c4e36e6c49344600df62999c9cd2))
- Users with permission can now mark other users to update their password on next login/use of their account. ([032418f](https://github.com/ProtoDigitalUK/lucid/commit/032418fb03f9631bb4b27827e3583212c1e69896))

### Breaking changes:

- Languages have been renamed to locales across the frontend/backend and are now controlled via config ([32f41b9](https://github.com/ProtoDigitalUK/lucid/commit/32f41b955c0e0536f60464f99c84796aa9af9ecb))
- Fields req and res objects now either return all locale translations or none depending on if the translation support flag is true on a field. ([e7d83c4](https://github.com/ProtoDigitalUK/lucid/commit/e7d83c48609132da8d70e5fedf6de3c8dc1fdfe2))

### Bug Fixes:

- Fixed issue with collection document multiple formatter not passing down the default locale config value. ([44c53e9](https://github.com/ProtoDigitalUK/lucid/commit/44c53e97ca69e4a567ee2167d86c0bca2b467997))
- Fixed issue with media panel not invalidating media in time when reopening the panel after updating it. ([4c2e806](https://github.com/ProtoDigitalUK/lucid/commit/4c2e80689fc9e03c2b77fa72c578aca0674b2432))
- Fixed issue where you could update the currently authenticate user with the update user endpoint. ([d640912](https://github.com/ProtoDigitalUK/lucid/commit/d640912ad18fb00dd9443f693be815fbf45e4e5a))
- Fixed issue where you could delete yourself and along with that all users. ([5e90524](https://github.com/ProtoDigitalUK/lucid/commit/5e9052440fea53eaee5423a8891cab161cdc14ba))
- Fixed issue with brick store group functions where required props weren't passed down that were required to target second level and deeper groups. ([469dce4](https://github.com/ProtoDigitalUK/lucid/commit/469dce4663f73a626739c51c594849bf8fc8a7ae))
- Fixed CSRF token refetching in fetch wrapper. ([70cb5b0](https://github.com/ProtoDigitalUK/lucid/commit/70cb5b0d9b23572c44857f867f9e67f52aff4289))
- Processed images now records size and gets set against the storage limit defined by config. ([fa83851](https://github.com/ProtoDigitalUK/lucid/commit/fa83851de37590473fdf89888774d091f8ca3751))

## v0.4.0-alpha.0

### Features:

- CMS frontend collection document rework.
- New supported features section on frontend settings page. ([2956ad6](https://github.com/ProtoDigitalUK/lucid/commit/2956ad6a6d3ad3adf5f2538cbf5855dc67b0e95f))

### Breaking changes:

- Group format on collection document request and response requires a group object which includes an id instead of being Fields[][]. Required for frontend to target group in a safer way. ([6ee503e](https://github.com/ProtoDigitalUK/lucid/commit/6ee503ed4642adaaabf33a35cd5fbafd72952059))

### Bug Fixes:

- Fixed type and casing errors across the frontend.
- Fixed issue where get multiple users endpoint would return duplicate user entries. ([52c6f1c](https://github.com/ProtoDigitalUK/lucid/commit/52c6f1c91851ee0a1e171a6784d34c43954330f8))
- Fixed count issue on selectMultipleFiltered in users repo. ([7a87468](https://github.com/ProtoDigitalUK/lucid/commit/7a874688e17fce5e8dda2fba5d8416afbf816a9a))
- Fixed count issue on selectMultipleFiltered in media repo. ([ef138f5](https://github.com/ProtoDigitalUK/lucid/commits/master/?before=ef4d6cf01ee0e8bcb92ddabc8138a38658273f04+35))
- Fixed perPage query param issue where we were still looking for the previous casing version. ([eb60f9b](https://github.com/ProtoDigitalUK/lucid/commit/eb60f9b7cc07d841459cd2b1f90ad1ac1f0c696a))
- Fixed use of flatFields in collection formatter. Now returns fieldTree like the fixed and builder bricks do. ([b77f892](https://github.com/ProtoDigitalUK/lucid/commit/b77f892df556735216f0425367ec979d20f2cbed))

## v0.3.0-alpha.0

### Features

- Repeater support on the collection builder. ([af6a5fc](https://github.com/ProtoDigitalUK/lucid/commit/af6a5fc5c73f5d37f9a2d3116319cef23e6f0424))
- Added the ability to lock collections from edits and deletion. ([c46fd2c](https://github.com/ProtoDigitalUK/lucid/commit/c46fd2c6424bdf2234a425f6e528eb35ebba0157))
- Added a new custom field to the field builder class to reference users. ([7fe7c25](https://github.com/ProtoDigitalUK/lucid/commit/7fe7c25ff269a848f2342ed135944b0b06e2d75d))

### Breaking Changes

- Removed collection document author column. ([d4c9e16](https://github.com/ProtoDigitalUK/lucid/commit/d4c9e164f8dd822436bafab45434765b0ed47e5a))
- Upsert bricks, fields and groups removed in favour of creating new entries on each request in preparation for revision system. ([a30c3f1](https://github.com/ProtoDigitalUK/lucid/commit/a30c3f1bffaa5759bf62d4233bffa79db43532ad))
- Groups are no longer tied to a language meaning in the page builder when swapping between languages you will have the same amount of groups for repeaters. ([08d810e](https://github.com/ProtoDigitalUK/lucid/commit/08d810ef3b7692b0cf704babd94466849deab2eb))
- Collection document upsert fields are now require a nested structure instead of being flat. They are now flattened internally so that you no longer have to worry about setting temp group ref ids. ([1c2e654](https://github.com/ProtoDigitalUK/lucid/commit/1c2e6542978f703f9a8780dc050ee3a26d8c5fa5))
- Collection document fields response is now nested instead of flat and doesn't return group array. ([2110341](https://github.com/ProtoDigitalUK/lucid/commit/2110341f5401c1cb6c398d0d990be0f2b9eef482))
- Removed addPageLink custom field from field builder. ([d2dcd6b](https://github.com/ProtoDigitalUK/lucid/commit/d2dcd6b7af9634686b35d9bf09247a6f9873045e))

### Bug Fixes

- Fixed issue with group parent id update query not working in SQLite. ([525d9e8](https://github.com/ProtoDigitalUK/lucid/commit/525d9e860fcf02d92864b94762d8e54e51de99a1))
- Added sort on field formatter groups to ensure correct group order. ([3a2c7e8](https://github.com/ProtoDigitalUK/lucid/commit/3a2c7e825433736fc2c61682a282aece21969a69))
- Get multiple document fields now include media and users joins. ([095fe8a](https://github.com/ProtoDigitalUK/lucid/commit/095fe8adb070b9494ec98fd3de4850583475c2ea))

## v0.2.0-alpha.0

### Features

- Added support to set disabled and hidden flags on specific custom fields ([693a1a0](https://github.com/ProtoDigitalUK/lucid/commit/693a1a0147b1dab4e6f1d17a1e2b25621ea8a2fe))
- New config option to disable serving swagger documentation site ([a4be9f4](https://github.com/ProtoDigitalUK/lucid/commit/a4be9f43276c9d7aed945e6f37304ec873b6de8b))

### Breaking Changes

- Collection document get multiple now uses standard format for filtering instead ([8180dc5](https://github.com/ProtoDigitalUK/lucid/commit/8180dc5fa2979447b9efd2a054fdaf95f47c4c52))

### Bug Fixes

- Core plugin semver check now supports version suffix (-alpha.0) etc ([7ada563](https://github.com/ProtoDigitalUK/lucid/commit/7ada5632ef80620533b9ded4558d56348a39ffe1))
