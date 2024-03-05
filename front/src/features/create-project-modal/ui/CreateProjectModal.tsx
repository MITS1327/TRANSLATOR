import { Modal, Btn, FileUploader, Select } from 'mcn-ui-components';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLangStore, useProjectStore } from '../../../entities';
import { TranslatorInput } from '../../../shared';

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
  const uploaderRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [langsIds, setLangsIds] = useState([]);

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
    const submitData = {
      name: data.project,
      langsIdsToFilesAssociations: langsIds,
      pootleFiles: files,
    };
    createProject(submitData);
    toggle(false);
  };

  const handleFilesChange = (data: any[]) => {
    setFiles((prev) => [...prev, data[0]?.file]);
  };

  const handleChangeSelect = (data: { name: string; data: { label: string; value: number } }) => {
    setLangsIds((prev) => [...prev, data.data.value]);
  };

  return (
    isOpen && (
      <Modal
        typeStyle='base'
        toggle={toggle}
        isOpen={isOpen}
        title='Добавить проект'
        renderFooter={() => (
          <div className={styles.modalFooter}>
            <Btn className={styles.cancel} kind='base-secondary' onClick={() => toggle(false)}>
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
            <TranslatorInput
              className={styles.formInput}
              name='project'
              placeholder='Название проекта'
              register={register}
              validationSchema={{ required: true }}
            />
            {errors.project && <>Заполните</>}
            {files?.map(() => (
              <div className={styles.formSelect}>
                <Select
                  placeholder='Язык'
                  typeStyle='base'
                  options={langSelectOptions}
                  name='lang'
                  onChange={handleChangeSelect}
                />
              </div>
            ))}
            <FileUploader ref={uploaderRef} onChange={handleFilesChange} />
          </form>
        </div>
      </Modal>
    )
  );
};
