export const BRAND_CSS = `
.bt-brand-whale[data-ds-brand-image]{display:block;width:22px;height:22px;flex:none;overflow:hidden}
.bt-brand-whale[data-ds-brand-image]>:not(img){display:none!important}
.bt-brand-whale[data-ds-brand-image]>img{display:block;width:100%;height:100%;object-fit:contain}
.bt-brand[role=button]{cursor:pointer}
.brandkit-dialog{width:min(520px,calc(100vw - 32px));max-height:calc(100vh - 48px);padding:0;border:1px solid var(--dsw-alias-border-l2,#8a8a8a55);border-radius:18px;background:var(--dsw-alias-bg-base,#191a1c);color:var(--dsw-alias-label-primary,#f5f6f8);box-shadow:0 24px 70px #0008;font:13px/1.45 system-ui,sans-serif}
.brandkit-dialog::backdrop{background:#0008;backdrop-filter:blur(4px)}
.brandkit-form{display:flex;flex-direction:column;gap:18px;padding:22px}
.brandkit-head{display:flex;align-items:flex-start;justify-content:space-between;gap:18px}
.brandkit-title{margin:0;font-size:18px;line-height:1.3}
.brandkit-hint{margin:4px 0 0;color:var(--dsw-alias-label-tertiary,#9da0a8)}
.brandkit-x{width:32px;height:32px;border:0;border-radius:50%;background:transparent;color:inherit;font-size:20px;cursor:pointer}
.brandkit-x:hover{background:var(--dsw-alias-interactive-bg-hover,#ffffff12)}
.brandkit-field{display:flex;flex-direction:column;gap:8px}
.brandkit-label{font-weight:600}
.brandkit-input,.brandkit-select{width:100%;box-sizing:border-box;height:38px;padding:0 11px;border:1px solid var(--dsw-alias-border-l3,#7778);border-radius:10px;background:var(--dsw-alias-bg-base,#202124);color:inherit;font:inherit}
.brandkit-row{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.brandkit-preview{width:44px;height:44px;flex:none;display:grid;place-items:center;border-radius:12px;background:var(--dsw-alias-bg-skeleton,#ffffff0d);overflow:hidden;font-weight:700}
.brandkit-preview img{width:100%;height:100%;object-fit:contain}
.brandkit-button,.brandkit-primary{height:34px;padding:0 14px;border:1px solid var(--dsw-alias-border-l3,#7778);border-radius:9px;background:transparent;color:inherit;font:inherit;cursor:pointer}
.brandkit-button:hover{background:var(--dsw-alias-interactive-bg-hover,#ffffff12)}
.brandkit-primary{border-color:transparent;background:var(--dsw-alias-button-primary-fill,#4d6bfe);color:var(--dsw-alias-label-primary-foreground,#fff);font-weight:600}
.brandkit-actions{display:flex;justify-content:space-between;gap:12px;padding-top:2px}
.brandkit-actions-right{display:flex;gap:8px}
.brandkit-preview[data-icon="brand"] img,.brandkit-preview[data-icon="footer"] img{display:block}
.dsb-footer-mark{width:36px;height:36px;border-radius:50%;display:inline-grid;place-items:center;overflow:hidden;background:color-mix(in srgb,currentColor 5%,transparent);box-shadow:inset 0 0 0 1px color-mix(in srgb,currentColor 13%,transparent)}
.dsb-footer-mark img{width:100%;height:100%;object-fit:contain}
.dsb-footer-mark img[data-account]{object-fit:cover}
.dsb-footer-default{display:inline-grid;place-items:center}
@media (max-width:600px){.brandkit-form{padding:18px}.brandkit-actions{align-items:stretch}.brandkit-actions-right{flex:1;justify-content:flex-end}}
`
