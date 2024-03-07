import { Btn } from 'mcn-ui-components';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useKeyStore } from 'entities';
import { TranslatorInput } from 'shared';
import { DefaultGetRequestPayload } from 'shared/types';

import styles from './UpdateCommentForm.module.scss';

type FormFields = {
  comment: string;
};

type Props = {
  initialValue: string;
  name: string;
  productId: string;
  getKeysParams: Partial<DefaultGetRequestPayload>;
};

export const UpdateCommentForm = (props: Props) => {
  const { initialValue, name, getKeysParams, productId } = props;
  const updateComment = useKeyStore((state) => state.updateComment);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    defaultValues: {
      comment: initialValue,
    },
  });

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    updateComment({ comment: data.comment, projectId: +productId, name }, getKeysParams);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.formContainer}>
        <div className={styles.formInput}>
          <TranslatorInput defaultValue={initialValue} name='comment' register={register} />
        </div>
        <Btn type='submit' kind='base-primary' onClick={handleSubmit(onSubmit)}>
          Принять
        </Btn>
      </div>
    </form>
  );
};
