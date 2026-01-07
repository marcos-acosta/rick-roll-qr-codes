import { ErrorCorrectionLevel, QrCodeData } from "@/types/interfaces";
import { selectRandom } from "./util";

const constructYoutubeUrl = (youtubeId: string) => {
  return `https://www.youtube.com/watch?v=${youtubeId}`;
};

const capitalizeDomain = (url: string) => {
  const splitByProtocol = url.split("://");
  const protocol = splitByProtocol[0];
  const remainingUrl = splitByProtocol[1];
  const remainingUrlSplitBySlash = remainingUrl.split("/");
  const domain = remainingUrlSplitBySlash[0];
  const path = remainingUrlSplitBySlash.slice(1).join("/");
  return `${protocol}://${domain.toLocaleUpperCase()}/${path}`;
};

const RICK_ROLL_YT_IDS = ["dQw4w9WgXcQ", "xvFZjo5PgG0", "iik25wqIuFo"];

const MASKS = [...Array(8).keys()];

const ERROR_LEVELS = [ErrorCorrectionLevel.LOW, ErrorCorrectionLevel.MEDIUM];

export const generateRandomRickRollQrCode = (): QrCodeData => {
  const youtubeId = selectRandom(RICK_ROLL_YT_IDS);
  const originalUrl = constructYoutubeUrl(youtubeId);
  const shouldCapitalizeDomain = Math.random() > 0.5;
  const mask = selectRandom(MASKS);
  const errorCorrectionLevel = selectRandom(ERROR_LEVELS);
  const url = shouldCapitalizeDomain
    ? capitalizeDomain(originalUrl)
    : originalUrl;
  return {
    url: url,
    mask: mask,
    errorCorrectionLevel: errorCorrectionLevel,
  };
};
