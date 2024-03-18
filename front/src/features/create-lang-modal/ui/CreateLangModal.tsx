import { Modal, Btn } from 'mcn-ui-components';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useLangStore } from 'entities';
import { TranslatorInput } from 'shared';

import styles from './CreateLangModal.module.scss';

type Props = {
  isOpen: boolean;
  toggle: React.Dispatch<React.SetStateAction<boolean>>;
};

type FormFields = {
  lang: string;
};

export const CreateLangModal = (props: Props) => {
  const { isOpen, toggle } = props;

  const createLang = useLangStore((state) => state.createLang);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    createLang(data.lang);
    toggle(false);
  };

  return (
    isOpen && (
      <Modal
        typeStyle='base'
        toggle={toggle}
        isOpen={isOpen}
        title='Добавить язык'
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
                name='lang'
                placeholder='Название языка'
                register={register}
                validationSchema={{ required: true }}
              />
            </div>
            {errors.lang && <>Заполните</>}
          </form>
        </div>
      </Modal>
    )
  );
};
