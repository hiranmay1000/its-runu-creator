import { useBrandTheme } from "../../context/ThemeContext";

export function Brand() {
  const { brandColor } = useBrandTheme();

  return (
    <span className="brand-name">
      _ITS_R<span style={{ color: brandColor }}>U</span>NU_
    </span>
  );
}
