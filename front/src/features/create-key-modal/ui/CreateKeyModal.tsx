import { useEffect } from 'react';
import { Modal, Btn } from 'mcn-ui-components';
import { buildFilterQuery } from 'mcn-ui-components/utils';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useKeyStore, useLangStore } from 'entities';
import { TranslatorInput } from 'shared';

import styles from './CreateKeyModal.module.scss';

type Props = {
  isOpen: boolean;
  projectId: string;
  toggle: React.Dispatch<React.SetStateAction<boolean>>;
};

type FormFields = {
  keyName: string;
  comment: string;
  [keyValue: string]: string;
};

export const CreateKeyModal = (props: Props) => {
  const { isOpen, projectId, toggle } = props;

  const getLangs = useLangStore((state) => state.getLangs);
  const langs = useLangStore((state) => state.langs);
  const createKey = useKeyStore((state) => state.createKey);

  useEffect(() => {
    getLangs();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    const { keyName, comment, ...other } = data;

    const values = Object.entries(other).map(([langId, value]) => ({
      langId: +langId,
      value: value.trim().length ? value.trim() : keyName,
    }));

    const reqBody = {
      name: keyName,
      comment,
      projectId: +projectId,
      values,
    };

    createKey(reqBody, {
      filter: buildFilterQuery('projectId', '$eq', [projectId]),
    });

    toggle(false);
  };

  return (
    isOpen && (
      <Modal
        typeStyle='base'
        toggle={toggle}
        isOpen={isOpen}
        title='Создать ключ'
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
            <div className={styles.formInput}>
              <TranslatorInput
                name='keyName'
                placeholder='Название ключа'
                register={register}
                validationSchema={{ required: true }}
              />
            </div>
            <div className={styles.multi}>
              {langs?.data.map((el) => (
                <div className={styles.multiItem}>
                  <div className={styles.multiItemName}>{el.name}</div>
                  <TranslatorInput
                    className={styles.multiInput}
                    name={`${el.id}`}
                    placeholder='Значение ключа'
                    register={register}
                  />
                </div>
              ))}
            </div>
            <div className={styles.commentInput}>
              <TranslatorInput
                name='comment'
                placeholder='Комментарий'
                register={register}
                validationSchema={{ required: true }}
              />
            </div>
          </form>
        </div>
      </Modal>
    )
  );
};
