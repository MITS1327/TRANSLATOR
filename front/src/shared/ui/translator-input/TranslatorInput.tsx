import { InputHTMLAttributes } from 'react';
import classNames from 'classnames';
import styles from './TranslatorInput.module.scss';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  register?: any;
  name?: string;
  validationSchema?: any;
}

export const TranslatorInput = (props: Props) => {
  const { className, register, name, validationSchema, ...rest } = props;
  return register ? (
    <input className={classNames(`${styles.input}`)} {...register(name, validationSchema)} {...rest} />
  ) : (
    <input className={classNames(`${styles.input}`)} {...rest} />
  );
};
