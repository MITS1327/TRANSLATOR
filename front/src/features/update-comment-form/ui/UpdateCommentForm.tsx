import { Btn } from 'mcn-ui-components';
import { buildFilterQuery } from 'mcn-ui-components/utils';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useKeyStore } from 'entities';
import { TranslatorInput } from 'shared';

import styles from './UpdateCommentForm.module.scss';

type FormFields = {
  comment: string;
};

type Props = {
  initialValue: string;
  name: string;
  productId: string;
};

export const UpdateCommentForm = (props: Props) => {
  const { initialValue, name, productId } = props;
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
    updateComment(
      { comment: data.comment, projectId: +productId, name },
      { filter: buildFilterQuery('projectId', '$eq', [productId]) },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.formContainer}>
        <TranslatorInput className={styles.formInput} defaultValue={initialValue} name='comment' register={register} />
        <Btn type='submit' kind='base-primary' onClick={handleSubmit(onSubmit)}>
          Принять
        </Btn>
      </div>
    </form>
  );
};
