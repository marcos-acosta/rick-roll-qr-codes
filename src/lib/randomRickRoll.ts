import { ErrorCorrectionLevel, QrCodeData } from "@/types/interfaces";
import { selectRandom } from "./util";
import qrcodegen from "nayuki-qr-code-generator";
import { errorCorrectionCodeToInternalObject } from "./qr";

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

export const getAllRickRolls = (): QrCodeData[] => {
  const qrCodeDatas: QrCodeData[] = [];
  for (const youtubeId of RICK_ROLL_YT_IDS) {
    for (const shouldCapitalizeDomain of [false, true]) {
      for (const mask of MASKS) {
        for (const errorCorrectionLevel of ERROR_LEVELS) {
          const originalUrl = constructYoutubeUrl(youtubeId);
          const url = shouldCapitalizeDomain ? capitalizeDomain(originalUrl) : originalUrl;
          qrCodeDatas.push({
            url: url,
            mask: mask,
            errorCorrectionLevel: errorCorrectionLevel
          })
        }
      }
    }
  }
  return qrCodeDatas;
}

const vectorizeQrCode = (qrCode: qrcodegen.QrCode) => {
  const size = qrCode.size;
  const vector: number[] = [];
  for (const y of [...Array(size).keys()]) {
    for (const x of [...Array(size).keys()]) {
      vector.push(+qrCode.getModule(x, y));
    }
  }
  return vector;
}

export const debugPrintAllVectorizedRickRollQrCodes = (): void => {
  const allRickRolls = getAllRickRolls();
  const allVectorizedRickRolls = [];
  for (const rickRollQrData of allRickRolls) {
    const segments = qrcodegen.QrSegment.makeSegments(rickRollQrData.url);
    const qrCode = qrcodegen.QrCode.encodeSegments(
      segments,
      errorCorrectionCodeToInternalObject(rickRollQrData.errorCorrectionLevel),
      3,
      4,
      rickRollQrData.mask,
      false
    );
    allVectorizedRickRolls.push(vectorizeQrCode(qrCode));
  }
  console.log(allVectorizedRickRolls);
}