import { Modal, Btn, Select } from 'mcn-ui-components';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useEffect, useMemo, useState } from 'react';
import { TranslatorInput, FileUploader } from 'shared';
import { useLangStore, useProjectStore } from '../../../entities';

import styles from './CreateProjectModal.module.scss';

type Props = {
  isOpen: boolean;
  toggle: React.Dispatch<React.SetStateAction<boolean>>;
};

type FormFields = {
  project: string;
};

export const CreateProjectModal = (props: Props) => {
  const { isOpen, toggle } = props;

  const [files, setFiles] = useState<Object>({});

  const createProject = useProjectStore((state) => state.createProject);
  const langs = useLangStore((state) => state.langs);
  const getLangs = useLangStore((state) => state.getLangs);

  useEffect(() => {
    getLangs();
  }, []);

  const langSelectOptions = useMemo(() => langs?.data.map((el) => ({ label: el.name, value: el.id })), [langs]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    const filesArr = Object.values(files);
    const submitData = {
      name: data.project,
      langsIdsToFilesAssociations: filesArr.map((el: any) => el.lang),
      pootleFiles: filesArr.map((el: any) => el.file),
    };

    createProject(submitData);
    toggle(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles((prev) => ({
        ...prev,
        [Object.keys(prev).length]: {
          file: event.target.files[0],
        },
      }));
    }
  };

  const handleChangeSelect = (
    data: { name: string; data: { label: string; value: number } },
    key: keyof typeof files,
  ) => {
    const preparedFiles = {
      ...files,
      [key]: {
        ...files[key],
        lang: data.data.value,
      },
    };

    setFiles(preparedFiles);
  };

  const getPreparedFiles = () => {
    return Object.values(files).map((element) => ({
      files: element,
      lang: element.lang,
    }));
  };

  const clearFiles = () => {
    setFiles({});
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
            {getPreparedFiles().map((element, key) => (
              <div key={element.files.file} className={styles.formMultiController}>
                <div className={styles.formSelect}>
                  <Select
                    placeholder='Язык'
                    typeStyle='base'
                    options={langSelectOptions}
                    name='lang'
                    onChange={(data: any) => handleChangeSelect(data, key.toString() as keyof typeof files)}
                  />
                </div>
                <div className={styles.formFile}>{element.files.file.name}</div>
              </div>
            ))}
            <div className={styles.fileUploader}>
              <FileUploader handleFileChange={handleFileChange} />
            </div>
          </form>
        </div>
      </Modal>
    )
  );
};
