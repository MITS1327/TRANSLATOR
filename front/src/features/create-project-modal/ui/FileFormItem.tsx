import { Select, Btn } from 'mcn-ui-components';
import { SelectData } from 'shared/types';
import styles from './CreateProjectModal.module.scss';

type Props = {
  itemKey: string;
  name: string;
  selectOptions: DefaultSelectOption<string, number>[];
  handleDeleteFile: (key: string) => void;
  onChangeSelect: (data: SelectData<number>, key: string) => void;
};

export const FileFormItem = (props: Props) => {
  const { selectOptions, itemKey, name, handleDeleteFile, onChangeSelect } = props;
  return (
    <div className={styles.formMultiItem}>
      <div className={styles.formSelect}>
        <Select
          placeholder='Язык'
          typeStyle='base'
          options={selectOptions}
          name='lang'
          onChange={(data: SelectData<number>) => onChangeSelect(data, itemKey)}
        />
      </div>
      <div className={styles.formFile}>{name}</div>
      <Btn img='close' kind='icon-text' onClick={() => handleDeleteFile(itemKey)} />
    </div>
  );
};
