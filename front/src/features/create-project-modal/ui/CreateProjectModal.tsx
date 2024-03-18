import { Modal, Btn } from 'mcn-ui-components';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useLayoutEffect, useMemo, useState } from 'react';
import { TranslatorInput, FileUploader } from 'shared';
import { SelectData } from 'shared/types';
import { useLangStore, useProjectStore } from 'entities';
import { CreateProjectPayload } from 'shared/api/translator/types';
import { FileFormItem } from './FileFormItem';

import styles from './CreateProjectModal.module.scss';

type Props = {
  isOpen: boolean;
  toggle: React.Dispatch<React.SetStateAction<boolean>>;
};

type FormFields = {
  project: string;
};

type TranslatorFile = {
  file: File;
  lang: number;
};

type FileState = Record<string, TranslatorFile>;

export const CreateProjectModal = (props: Props) => {
  const { isOpen, toggle } = props;

  const [files, setFiles] = useState<FileState>({});

  const createProject = useProjectStore((state) => state.createProject);
  const langs = useLangStore((state) => state.langs);
  const getLangs = useLangStore((state) => state.getLangs);

  useLayoutEffect(() => {
    getLangs();
  }, []);

  const langSelectOptions = useMemo(() => langs?.data.map((el) => ({ label: el.name, value: el.id })), [langs]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    const filesArr = Object.values(files);

    const submitData = filesArr.reduce<CreateProjectPayload>(
      (acc, el) => ({
        ...acc,
        langsIdsToFilesAssociations: [...acc.langsIdsToFilesAssociations, el.lang.toString()],
        pootleFiles: [...acc.pootleFiles, el.file],
      }),
      {
        name: data.project,
        langsIdsToFilesAssociations: [],
        pootleFiles: [],
      },
    );

    createProject(submitData);
    toggle(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiles((prev) => ({
      ...prev,
      [event.target.files[0].name]: {
        file: event.target.files[0],
        lang: null,
      },
    }));
  };

  const handleChangeSelect = (data: SelectData<number>, key: string) => {
    const preparedFiles = {
      ...files,
      [key]: {
        ...files[key],
        lang: data.data.value,
      },
    };

    setFiles(preparedFiles);
  };

  const handleDeleteFile = (fileKey: string) => {
    setFiles((current) => {
      const { [fileKey]: removed, ...rest } = current;
      return rest;
    });
  };

  const clearFiles = () => {
    setFiles({});
    reset();
    toggle(false);
  };

  return (
    isOpen && (
      <Modal
        typeStyle='base'
        toggle={toggle}
        isOpen={isOpen}
        onClose={clearFiles}
        title='Добавить проект'
        renderFooter={() => (
          <div className={styles.modalFooter}>
            <Btn className={styles.cancel} kind='base-secondary' onClick={clearFiles}>
              Отмена
            </Btn>
            <Btn type='submit' kind='base-primary' onClick={handleSubmit(onSubmit)}>
              Принять
            </Btn>
          </div>
        )}
      >
        <div className={styles.form}>
          <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formInput}>
              <TranslatorInput
                name='project'
                placeholder='Название проекта'
                register={register}
                validationSchema={{ required: true }}
              />
            </div>
            {errors?.project && <>Заполните</>}
            <div className={styles.formMultiContainer}>
              {Object.values(files).map((element) => (
                <FileFormItem
                  key={element.file.name}
                  itemKey={element.file.name}
                  name={element.file.name}
                  selectOptions={langSelectOptions}
                  handleDeleteFile={handleDeleteFile}
                  onChangeSelect={handleChangeSelect}
                />
              ))}
            </div>
            <div className={styles.fileUploader}>
              <FileUploader handleFileChange={handleFileChange} />
            </div>
          </form>
        </div>
      </Modal>
    )
  );
};
