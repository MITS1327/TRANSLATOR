import { useRef } from 'react';
import { Btn } from 'mcn-ui-components';

import styles from './FileUploader.module.scss';

type Props = {
  handleUpload?: () => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const FileUploader = (props: Props) => {
  const { handleFileChange } = props;
  const uploaderRef = useRef(null);

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    uploaderRef.current.click();
  };

  return (
    <div className={styles.fileUploader}>
      <input className={styles.fileUploaderInput} type='file' multiple ref={uploaderRef} onChange={handleFileChange} />
      <Btn className={styles.headerItem} onClick={handleClick} kind='base'>
        Добавить файл
      </Btn>
    </div>
  );
};
