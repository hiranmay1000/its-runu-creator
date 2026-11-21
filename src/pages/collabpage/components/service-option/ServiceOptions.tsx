import type { CollabFormState, PlatformId } from "../../types";
import { PromotionalScope } from "./PromotionalScope";
// Import future service components here:
// import { EventAppearanceOptions } from "./EventAppearanceOptions";

interface ServiceOptionsProps {
  service: string;
  form: CollabFormState;
  totalSelectedFormats: number;
  onTogglePlatformFormat: (platformId: PlatformId, format: string) => void;
}

export function ServiceOptions({
  service,
  form,
  totalSelectedFormats,
  onTogglePlatformFormat,
}: ServiceOptionsProps) {
  switch (service) {
    case "Promotional Content":
      return (
        <PromotionalScope
          form={form}
          totalSelectedFormats={totalSelectedFormats}
          onTogglePlatformFormat={onTogglePlatformFormat}
        />
      );

    // Add future service UIs here:
    //
    // case "Event Appearance":
    //   return <EventAppearanceOptions />;
    //
    // case "Brand Collaboration":
    //   return <BrandCollaborationOptions />;

    default:
      return null;
  }
}
