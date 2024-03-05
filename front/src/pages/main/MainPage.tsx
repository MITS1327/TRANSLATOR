import { useMemo, useState, useEffect } from 'react';
import { Btn } from 'mcn-ui-components';
import { buildFilterQuery } from 'mcn-ui-components/utils';
import { Table } from '@alfalab/core-components-table';
import { Link } from 'react-router-dom';
import { useProjectStore } from '../../entities';
import { CreateLangModal, CreateProjectModal } from '../../features';
import { TranslatorInput } from '../../shared';

import styles from './Main.module.scss';

export const MainPage = () => {
  const getProjects = useProjectStore((state) => state.getProjects);
  const projects = useProjectStore((state) => state.projects);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenLang, setIsOpenLang] = useState(false);
  const [search, setSearch] = useState('');

  const DATA_SIZE = projects?.totalCount;
  const PER_PAGE = 20;
  const [page, setPage] = useState(0);
  const handlePageChange = (pageIndex: number) => setPage(pageIndex);
  const pagesCount = Math.ceil(DATA_SIZE / PER_PAGE);

  const getProjectsParams = useMemo(
    () => ({
      limit: PER_PAGE,
      offset: search.length ? 0 : PER_PAGE * page,
      filter: [buildFilterQuery('name', '$ILike', [search])],
    }),
    [search, page],
  );

  useEffect(() => {
    getProjects(getProjectsParams);
  }, [getProjectsParams]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Btn className={styles.headerItem} onClick={() => setIsOpen(true)} kind='base'>
          Добавить проект
        </Btn>
        <Btn className={styles.headerItem} onClick={() => setIsOpenLang(true)} kind='base'>
          Добавить язык
        </Btn>
        <TranslatorInput
          className={styles.headerItem}
          placeholder='Поиск'
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)}
        />
      </div>
      <div className={styles.table}>
        <Table
          className={styles.tableContainer}
          pagination={
            <Table.Pagination
              perPage={PER_PAGE}
              currentPageIndex={page}
              pagesCount={pagesCount}
              onPageChange={handlePageChange}
            />
          }
        >
          <Table.THead>
            <Table.THeadCell>Название</Table.THeadCell>
            <Table.THeadCell textAlign='right'>Всего</Table.THeadCell>
          </Table.THead>
          <Table.TBody>
            {projects?.data.map((project) => (
              <Table.TRow key={project.id}>
                <Table.TCell>
                  <div>
                    <Link to={`translator/${project.id}`}>
                      <div>{project.name}</div>
                    </Link>
                  </div>
                </Table.TCell>

                <Table.TCell>
                  <div>
                    <div>{project.keysCount}</div>
                  </div>
                </Table.TCell>
              </Table.TRow>
            ))}
          </Table.TBody>
        </Table>
      </div>
      <CreateProjectModal isOpen={isOpen} toggle={setIsOpen} />
      <CreateLangModal isOpen={isOpenLang} toggle={setIsOpenLang} />
    </div>
  );
};
