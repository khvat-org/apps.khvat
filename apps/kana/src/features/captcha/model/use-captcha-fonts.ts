import { useRemoteConfig } from "@nihongo/core/shared/contexts/remote-config/remote-config-context";
import { useFeatureFlag } from "@nihongo/core/shared/services/feature-flags-service/feature-flags-service";

import { CaptchaFont, captchaFontsSchema } from "./captcha-fonts";

export const useCaptchaFonts = (): CaptchaFont[] | null => {
  const { getField } = useRemoteConfig();
  const isEnabled = useFeatureFlag("practice_captcha");

  if (!isEnabled) return null;

  const conf = captchaFontsSchema.safeParse(getField("captcha_fonts"));

  return conf.success ? conf.data.fonts : null;
};
