import qrcodegen from "nayuki-qr-code-generator";
import styles from "./../app/page.module.css";
import { QrCodeDataMaskOptional } from "@/types/interfaces";
import { errorCorrectionCodeToInternalObject } from "@/lib/qr";

interface QrCodeProps {
  qrCodeData: QrCodeDataMaskOptional;
  minVersion?: number;
  maxVersion?: number;
}

export default function QrCode(props: QrCodeProps) {
  const segments = qrcodegen.QrSegment.makeSegments(props.qrCodeData.url);

  const qrCode = qrcodegen.QrCode.encodeSegments(
    segments,
    errorCorrectionCodeToInternalObject(props.qrCodeData.errorCorrectionLevel),
    props.minVersion ?? 1,
    props.maxVersion ?? 40,
    props.qrCodeData.mask,
    false
  );
  const size = qrCode.size;
  return (
    <div
      className={styles.qrCode}
      style={{
        gridTemplateRows: `repeat(${size}, 1fr)`,
        gridTemplateColumns: `repeat(${size}, 1fr)`,
      }}
    >
      {Array.from({ length: size }, (_, y) =>
        Array.from({ length: size }, (_, x) => {
          const isBlack = qrCode.getModule(x, y);
          return (
            <div
              key={`${x}-${y}`}
              className={`${styles.module} ${
                isBlack ? styles.black : styles.white
              }`}
              style={{ gridRow: y + 1, gridColumn: x + 1 }}
            />
          );
        })
      )}
    </div>
  );
}
