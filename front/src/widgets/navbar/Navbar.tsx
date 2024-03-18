import { useMemo } from 'react';
import classNames from 'classnames';
import { Link, useLocation } from 'react-router-dom';

import styles from './Navbar.module.scss';

export const Navbar = () => {
  const location = useLocation();

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

  return (
    <div className={styles.container}>
      {items.map((el) => (
        <Link
          to={el.link}
          className={classNames(styles.item, {
            [styles.activeItem]: el.link === pathname,
          })}
        >
          <div>{el.name}</div>
        </Link>
      ))}
    </div>
  );
};
