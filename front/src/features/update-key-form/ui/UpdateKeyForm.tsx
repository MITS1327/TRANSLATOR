import { Btn } from 'mcn-ui-components';
import { buildFilterQuery } from 'mcn-ui-components/utils';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useKeyStore } from 'entities';
import { TranslatorInput } from 'shared';

import styles from './UpdateKeyForm.module.scss';

type FormFields = {
  key: string;
};

type Props = {
  initialValue: string;
  keyId: number;
  productId: string;
};

export const UpdateKeyForm = (props: Props) => {
  const { initialValue, keyId, productId } = props;
  const updateKey = useKeyStore((state) => state.updateKeys);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    defaultValues: {
      key: initialValue,
    },
  });

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    updateKey({ id: keyId, value: data.key }, { filter: buildFilterQuery('projectId', '$eq', [productId]) });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.formContainer}>
        <div className={styles.formInput}>
          <TranslatorInput defaultValue={initialValue} name='key' register={register} />
        </div>
        <Btn type='submit' kind='base-primary' onClick={handleSubmit(onSubmit)}>
          Принять
        </Btn>
      </div>
    </form>
  );
};
