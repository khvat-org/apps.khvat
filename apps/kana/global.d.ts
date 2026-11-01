/* eslint-disable @typescript-eslint/no-explicit-any */

declare module "react-native-rustore-review" {
  interface RustoreReviewClient {
    init(): Promise<void>;
    requestReviewFlow(): Promise<boolean>;
    launchReviewFlow(): Promise<void>;
  }

  const RustoreReviewClient: RustoreReviewClient;
  export default RustoreReviewClient;
}

declare module "*.png" {
  const content: any;
  export default content;
}

declare module "*.jpg" {
  const content: any;
  export default content;
}

declare module "*.svg" {
  const content: React.FC<React.SVGProps<SVGSVGElement>>;
  export default content;
}

declare module "*.mp3" {
  const content: any;
  export default content;
}

declare module "*.svg" {
  import React from "react";

  import { SvgProps } from "react-native-svg";

  interface CustomSvgProps extends SvgProps {
    letter?: string;
    arrow?: string;
  }

  const content: React.FC<CustomSvgProps>;
  export default content;
}
