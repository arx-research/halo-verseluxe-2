import React from 'react'

export default function Settings() {
  const s = (window as any).HALO_SETTINGS

  return (
    <style>
      {`
    :root {
      --logoSize: ${s.logoSize}px;
      --backgroundColor: ${s.backgroundColor};
      --headerButtonColor: ${s.headerButtonColor};
      --cardColor: ${s.cardColor};
      --cardTextColor: ${s.cardTextColor};
      --cardLinkColor: ${s.cardLinkColor};
      --cardSubheadingColor: ${s.cardSubheadingColor};
      --cardBorderColor: ${s.cardBorderColor};
      --footerColor: ${s.footerColor};
      --dropdownOverlayColor: ${s.dropdownOverlayColor};
      --dropdownColor: ${s.dropdownColor};
      --dropdownTextColor: ${s.dropdownTextColor};
      --dropdownBorderColor: ${s.dropdownBorderColor};
      --dropdownIndicatorColor: ${s.dropdownIndicatorColor};
      --dropdownDisconnectColor: ${s.dropdownDisconnectColor};
      --borderRadius: ${s.borderRadius}px;
      --headerButtonBorderRadius: ${s.headerButtonBorderRadius}px;
      --sidePadding: ${s.sidePadding}px;
      --headerPadding: ${s.headerPadding}px;
      --claimColor: ${s.claimColor};
      --claimColorDisabled: ${s.claimColorDisabled};
      --claimTextColor: ${s.claimTextColor};
      --claimTextColorDisabled: ${s.claimTextColorDisabled};
      --claimButtonColor: ${s.claimButtonColor};
      --claimButtonTextColor: ${s.claimButtonTextColor};
      --claimButtonColorHover: ${s.claimButtonColorHover};
      --claimButtonTextColorHover: ${s.claimButtonTextColorHover};
      --claimButtonColorDisabled: ${s.claimButtonColorDisabled};
      --claimButtonTextColorDisabled: ${s.claimButtonTextColorDisabled};
      --textScale: ${s.textScale};
      --scanBackgroundColor: ${s.scanBackgroundColor};
      --scanTextColor: ${s.scanTextColor};
    }
    @font-face {
      font-family: 'body';
      src: url("${s.bodyFont}");
      font-weight: normal;
      font-style: normal;
    }
    @font-face {
      font-family: 'headings';
      src: url("${s.headingFont}");
      font-weight: bold;
      font-style: normal;
    }
  `}
    </style>
  )
}
