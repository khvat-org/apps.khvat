# Features flags

Allows you to hide functionality

**Main files**:

- `packages/core/shared/services/feature-flags-service/feature-flags-service.ts` - Flag checking service

**Where flags come from**:

1. `FEATURE_FLAGS` from `.env`, built into the app. Used until the app has received flags from the server.
2. `feature_flags` from `/api/conf`, an array of strings. It fully replaces the flags from `.env`, so a flag can be turned off or on without a release. The last received value is kept on the device and is used offline.

If `/api/conf` has no `feature_flags` key, or the value is not an array of strings, the flags from `.env` are used. To turn everything off, set `[]`.

The config is requested at app start, on language change, and when the app returns to the foreground if the last successful request was more than 5 minutes ago.

**Example of an entry in .env**:

```
FEATURE_FLAGS=["develop", "askAI"]
```

**Example of use**:

In components use the hook: it re-renders the component when flags change.

```js
import { useFeatureFlag } from '@nihongo/core/shared/services/feature-flags-service/feature-flags-service';

const isEnabled = useFeatureFlag('qualificationRequirements');

{isEnabled && (
  ...
)}
```

Outside of components use `FeatureFlagsService.isEnabled('qualificationRequirements')`.
