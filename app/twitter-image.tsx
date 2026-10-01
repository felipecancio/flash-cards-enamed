import { site } from "@/config/site";
import { createSocialImage, socialContentType, socialSize } from "@/lib/social-image";

export const alt = site.name;
export const size = socialSize;
export const contentType = socialContentType;

export default function TwitterImage() {
  return createSocialImage();
}
