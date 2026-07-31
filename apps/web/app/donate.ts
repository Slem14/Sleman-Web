/**
 * Donation destination.
 *
 * Deliberately a plain outbound link rather than Ko-fi's embeddable widget.
 * The widget is an iframe that loads third-party JavaScript and sets cookies,
 * so it would need to sit behind the consent gate and would add a tracking
 * surface to a site whose central claim is that nothing third-party runs.
 * A link is identical for the donor and costs us nothing.
 *
 * It also never appears on the upload or result routes — the same rule the
 * ads follow. Someone reading a deportation notice must not be asked for
 * money in the same breath.
 */
export const DONATE_URL = "https://ko-fi.com/sleman";
