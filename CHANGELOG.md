# @lucidcms/core

## v0.8.0-alpha.0

### Features:

- Implemented a new document custom field type so you can define relationships between documents. ([a9da47d](https://github.com/ProtoDigitalUK/lucid/commit/a9da47d05236a56a268fe4ea4fe80e1b790c201c))
- New pages plugin added, that enables support for slugs and parent pages on given collections. Computes a fullSlug based on ancestor documents that makes fetching the document based on browser location possible. ([bd495f8](https://github.com/ProtoDigitalUK/lucid/commit/bd495f811b940e7b5e779263cc9ebc28ffa92dbc))
- Document custom field queries updated to return target documents collection fields in its meta - works for internal and client document endpoints. ([622dfeb](https://github.com/ProtoDigitalUK/lucid/commit/622dfebbb1731ac618c940c9a50eb31bd0f60c87))
- Title and alt translations format update for the media custom field meta so that it matches the format of the translations and meta. ([5d3127f](https://github.com/ProtoDigitalUK/lucid/commit/5d3127f2ce40796aa69382bc9b5b84b1cecbc7be))

### Breaking changes:

- Hook and email strategy response format updated to match that of services and media strategies. ([2db7995](https://github.com/ProtoDigitalUK/lucid/commit/2db799591d1bb32ed2c28ea4f13ca81c394bb45c))
- Hook functions now use same type as services do internally to keep consistent and give the ability for hooks to use services, db and config from Lucid. ([5cebd3c](https://github.com/ProtoDigitalUK/lucid/commit/5cebd3c12111e7c2e49cadb92a966d14886e199d))
- Migration file edit for the document custom field. ([88db286](https://github.com/ProtoDigitalUK/lucid/commit/88db2860f0725b0605709e0e8d2a6531df25ef0d))
- Builders, adapters and some utilities have had their exports moved from the root of core to a more appropriate path. ([24f0c11](https://github.com/ProtoDigitalUK/lucid/commit/24f0c114e428f47b82018e5558983936f79ad445))

### Bug Fixes:

- Fixed user, media and doc validation by having null/undefined check happen before data exists check which is now also moved into the respective custom field. ([867015f](https://github.com/ProtoDigitalUK/lucid/commit/867015fdd70adbbf33efbd24b875007aea6d77b0))
- Fixed delete document bug where field document_id wasn't being set null on cascade as expected because we don't actually delete documents - only soft delete them. ([8881ea3](https://github.com/ProtoDigitalUK/lucid/commit/8881ea3db04efa7fb20f2adec224935f37d55011))
- Fixed create document bug causing state to reset when collection endpoint was called when opening the select document modal. ([2335583](https://github.com/ProtoDigitalUK/lucid/commit/2335583e903309b9dae9b976fe06767d7e6c7c91))
- Successfully creating a single collection document now invalidates collection.getAll key so that the collection navigation knows not to take you back to the create page for that collection. ([34240c7](https://github.com/ProtoDigitalUK/lucid/commit/34240c7824f9386ad6ad85252283c49fb4fec890))
- Fetch single collection now uses collection key param in query - before it was possible to fetch documents from other collections despite being seemingly scoped to a collection via the endpoint. ([ee2b336](https://github.com/ProtoDigitalUK/lucid/commit/ee2b336b29065cfbf75bb5a844e72ab3cb18d826))
- Fixed issue causing brick store to get reset when the document select modal fetched collection config, as well as a document fetch issues when changing documents. ([c93937c](https://github.com/ProtoDigitalUK/lucid/commit/c93937ca4e7a0fc486177798dcaefabd914db286))
- Moved away from local version of Kysely’s ParseJSONResultsPlugin now that the LibSQL adapter is no longer using @‌libsql/hrana-client which was returning an immutable response. ([7b97c53](https://github.com/ProtoDigitalUK/lucid/commit/7b97c535d967aa88a6a285da8b96d6a98fbef45b))

## v0.7.0-alpha.0

### Features:

- Document builder visual overhaul along with QOL changes to UI across the SPA.
- Error message revamp for SPA document page builder with support for tabs highlighting if an error resides within it. ([c283824](https://github.com/ProtoDigitalUK/lucid/commit/c283824cf80d185666cd53d7641fbd92005d52ec))
- Added support for returning nested repeater fields on client/toolkit document single and multiple fetches. ([befb65a](https://github.com/ProtoDigitalUK/lucid/commit/befb65af1c1ef3a032a0b247a2b08235f12e8138))
- Image media now includes a blur hash that is generated on upload. ([7ee6461](https://github.com/ProtoDigitalUK/lucid/commit/7ee6461736f838bc858824d259770f7b6cc2351e))
- Image media no includes average colour RGBA value and is light/dark information. ([be2a254](https://github.com/ProtoDigitalUK/lucid/commit/be2a2546a67f0901a33644bc9919f5cc88cda9c4))
- Holding page styled and content added. ([b8ab6d0](https://github.com/ProtoDigitalUK/lucid/commit/b8ab6d08b0429b9352657187173b2019f234eea8))

### Breaking changes:

- Response format of client document endpoints is updated to return a field object instead of array to make consuming data easier. ([11aa7ce](https://github.com/ProtoDigitalUK/lucid/commit/11aa7ceee37c25bd71cbe0b741b594f6b849f684))
- Existing migration file edit for media blur hash, average colour columns meaning db will need to be re-created. ([be2a254](https://github.com/ProtoDigitalUK/lucid/commit/be2a2546a67f0901a33644bc9919f5cc88cda9c4))
- Response type of media strategies update to use ServiceResponse type to fall inline with how internal services work. ([af95561](https://github.com/ProtoDigitalUK/lucid/commit/af955617357e26ae6476a3a4873e8d68dbe29e3e))
- Clear single processed image route fix to use media ID instead of key due to key containing slashes now. ([f340b2f](https://github.com/ProtoDigitalUK/lucid/commit/f340b2f033cee073b6a394b76d9b8880ca16772f))

### Bug Fixes:

- Fixed upsert document not updating the updated_at field. ([764f078](https://github.com/ProtoDigitalUK/lucid/commit/764f0783704bcefe8da0cd878fa819bf21a18f63))
- Fixed issue with updated media panel trying to refetch deleted media when panel was closed. ([0b042db](https://github.com/ProtoDigitalUK/lucid/commit/0b042dbad3d6761d28e3521a657d62b7ea1d410b))
- Flatten fields helper now adds field for every locale regardless if the locale has been given in the payload which fixes issues with required validation. ([65bd6ae](https://github.com/ProtoDigitalUK/lucid/commit/65bd6aea94b6e3fba1010190c05a134f6c9a1ffc))

## v0.6.0-alpha.0

### Features:

- Client integration endpoints and authentication middleware added along with settings area for it within the SPA. ([4ef95c2](https://github.com/ProtoDigitalUK/lucid/commit/4ef95c28aed5508c1e17e83831e090be54943bb9))
- Rate limiting added to the API and messaging within SPA. ([3d73bf2](https://github.com/ProtoDigitalUK/lucid/commit/3d73bf24510ca435d4d8b89f84e62801df732363))
- Users now have their own secret generated and stored against them for hashing their password with argon2. It’s also setup to regenerate whenever a password is updated. ([6a10b44](https://github.com/ProtoDigitalUK/lucid/commit/6a10b442555f0bd14ddd3b53903f7c1092873b29))
- Fetch documents client endpoint added along with toolkit support. ([fbcf50f](https://github.com/ProtoDigitalUK/lucid/commit/fbcf50fc90f5f9fa911fcba27881834eea91182d))
- Fetch all locales client endpoint added along with toolkit support . ([5e54359](https://github.com/ProtoDigitalUK/lucid/commit/5e5435937c9421b4fa4b4a9c002ee9b1ee907bd9))

### Breaking changes:

- Lucid config keys have new validation schema - they are now required to be 64 characters long. ([e45701d](https://github.com/ProtoDigitalUK/lucid/commit/e45701d4dfbd2571414fd954db40b946299ed514))

### Bug Fixes:

- Fixed bug on processed image where we didn't wait for the upload to finish. ([cbc7a84](https://github.com/ProtoDigitalUK/lucid/commit/cbc7a848b01b8d9765b71d0e6bc3e00fe5ffc3b0))
- Fixed issue where serviceWrapper didn't return result of fn if it wasn't within a transaction - caused 30ms delay on requests in some places. ([b2e92fe](https://github.com/ProtoDigitalUK/lucid/commit/b2e92fe99ecca787dd293260cf6ec98afd93ea51))
- Fixed serviceWrapper bug that meant default error wasn't being merged into the fn error result. ([51412f8](https://github.com/ProtoDigitalUK/lucid/commit/51412f8907166cfd981aa8bc0051a745dc3d0ed4))
- Fixed bug with render template service where template data wasn't being passed down correctly. ([ef30d80](https://github.com/ProtoDigitalUK/lucid/commit/ef30d80162fca0dfa5996df40493103bb1522993))
- Fixed issue with get multiple filtered collection docs where it required collection fields to be included for them to be filterable. ([9c672dc](https://github.com/ProtoDigitalUK/lucid/commit/9c672dcabe63458b050317cf27e683512153be34))

## v0.5.0-alpha.4

### Features:

- Multiple tests added for custom fields and builders along with new validation rules.
- Reworked service wrapper to support transactions, schema validation, default errors and errors as values. ([9f12aa4](https://github.com/ProtoDigitalUK/lucid/commit/9f12aa4e3a5ddb9fc93d4a906f6384ca1d574e92))
- Improved error handling for database migrations and Lucid server. ([131edc0](https://github.com/ProtoDigitalUK/lucid/commit/131edc0885a5986482f5725f37867c930c75f1ec))
- New cronjob added to clear locales that have been deleted for 30 days. ([3c1b7ea](https://github.com/ProtoDigitalUK/lucid/commit/3c1b7ea45d321b405c219fb12f25b54cd7af8ed8))

### Bug Fixes:

- Fixed issue with media and user validation where if no value was selected it would error regardless of validation rules due to validate method not being called and default valid state being false. ([b3b3e27](https://github.com/ProtoDigitalUK/lucid/commit/b3b3e2792b023b3c130a3627dd6a1256d49e699e))

## v0.5.0-alpha.3

### Bug Fixes:

- Fixed format insert field not using brick instance to find custom field class. ([1a8fad5](https://github.com/ProtoDigitalUK/lucid/commit/1a8fad55f63f36d2fab3767b0323328b8459b233))
- Fixed issue with field validation expecting a brick to have an id else continuing a loop and not validating the field. ([3aacf8d](https://github.com/ProtoDigitalUK/lucid/commit/3aacf8d6725a4cd94e327a9bae712eb443c68fa5))
- Updated add brick modal component to support brick title and description locale variations. ([0c71513](https://github.com/ProtoDigitalUK/lucid/commit/0c71513abc53bd49b0a0ba13f619f98ea2a8a4f4))
- Fixed Postgres issue with title_translations.value and alt_translations.value not being in groupBy function. ([38c13e3](https://github.com/ProtoDigitalUK/lucid/commit/38c13e34c9c96269a88c9f001a4583d674d3f33a))
- Fixed issue with validation and error handling where brick id wasn’t being used to identify field error. Meant fields with same key would share errors. ([6bc477e](https://github.com/ProtoDigitalUK/lucid/commit/6bc477ee08ebc0adb5f578fd27648db6eff712a8))

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
