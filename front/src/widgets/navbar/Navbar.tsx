import classNames from 'classnames';
import { Link, useLocation, useParams } from 'react-router-dom';

import styles from './Navbar.module.scss';

export const Navbar = () => {
  const location = useLocation();
  const params = useParams<Record<string, string>>();

  const { pathname } = location;

  const items = [
    {
      link: '/all',
      name: 'Все ключи',
    },
    {
      link: '/projects',
      name: 'Проекты',
    },
  ];

  const baseUrl = Object.values(params).reduce((path, param) => path.replace(`/${param}`, ''), pathname);

  return (
    <div className={styles.container}>
      {items.map((el) => (
        <Link
          to={el.link}
          className={classNames(styles.item, {
            [styles.activeItem]: el.link === baseUrl,
          })}
        >
          <div>{el.name}</div>
        </Link>
      ))}
    </div>
  );
};
