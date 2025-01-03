import { useMemo, useState, useEffect, ReactElement, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table } from '@alfalab/core-components-table';
import { TextAlignProperty } from '@alfalab/core-components-table/typings';
import { TCellProps, TCell } from '@alfalab/core-components-table/components';

import { Btn, Preloader } from 'mcn-ui-components';
import { buildFilterQuery } from 'mcn-ui-components/utils';

import { Navbar } from 'widgets';
import { KeyTypeEnum } from 'shared/types';
import { useLangStore, useProjectStore } from 'entities';
import { CreateLangModal, CreateProjectModal } from 'features';
import { DEFAULT_CURRENT_PAGE, DEFAULT_LIMIT_PER_PAGE, TranslatorInput } from 'shared';

import styles from './Main.module.scss';

type TableHeading = {
  name: string;
  textAlign: TextAlignProperty;
};

export const MainPage = () => {
  const getProjects = useProjectStore((state) => state.getProjects);
  const projects = useProjectStore((state) => state.projects);
  const getLangs = useLangStore((state) => state.getLangs);
  const langs = useLangStore((state) => state.langs);
  const isLoading = useProjectStore((state) => state.isLoading);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenLang, setIsOpenLang] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE);
  const [limitPerPage, setLimitPerPage] = useState(DEFAULT_LIMIT_PER_PAGE);

  const DATA_SIZE = projects?.totalCount;
  const pagesCount = Math.ceil(DATA_SIZE / limitPerPage);

  const handleCurrentPageChange = (pageIndex: number) => setCurrentPage(pageIndex);
  const handleLimitPerPageChange = (perPage: number) => setLimitPerPage(perPage);

  const getProjectsParams = useMemo(
    () => ({
      limit: limitPerPage,
      offset: search.length ? 0 : limitPerPage * currentPage,
      filter: [buildFilterQuery('name', '$ILike', [search])],
    }),
    [search, currentPage, limitPerPage],
  );

  useEffect(() => {
    getProjects(getProjectsParams);
  }, [getProjectsParams]);

  useLayoutEffect(() => {
    getLangs();
  }, []);

  const tableHeadings = useMemo<TableHeading[]>(
    () => [
      { name: 'Название', textAlign: 'left' },
      ...(projects?.data.length
        ? Object.keys(projects.data[0].untranslatedKeysByLang).map<TableHeading>((el) => ({
            name: el,
            textAlign: 'center',
          }))
        : []),
      { name: 'Всего', textAlign: 'right' },
    ],
    [projects],
  );

  const getLangIdByName = (langName: string) => {
    return langs?.data.find((el) => el.name === langName).id;
  };

  return (
    <div className={styles.page}>
      <Navbar />
      {isLoading && <Preloader typeStyle='base' />}
      <div className={styles.header}>
        <Btn className={styles.headerItem} onClick={() => setIsOpen(true)} kind='base'>
          Добавить проект
        </Btn>
        <Btn className={styles.headerItem} onClick={() => setIsOpenLang(true)} kind='base'>
          Добавить язык
        </Btn>
        <div className={styles.headerItem}>
          <TranslatorInput
            placeholder='Поиск'
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)}
          />
        </div>
      </div>
      <div className={styles.table}>
        <Table
          className={styles.tableContainer}
          pagination={
            <Table.Pagination
              pagesCount={pagesCount}
              perPage={limitPerPage}
              onPerPageChange={handleLimitPerPageChange}
              currentPageIndex={currentPage}
              onPageChange={handleCurrentPageChange}
            />
          }
        >
          <Table.THead>
            {tableHeadings.map((el) => (
              <Table.THeadCell textAlign={el.textAlign}>{el.name}</Table.THeadCell>
            ))}
          </Table.THead>
          <Table.TBody>
            {projects?.data.map((project) => (
              <Table.TRow key={project.id}>
                <Table.TCell>
                  <div>
                    <Link to={`projects/${project.id}`}>
                      <div>{project.name.toUpperCase()}</div>
                    </Link>
                  </div>
                </Table.TCell>

                {
                  Object.entries(project.untranslatedKeysByLang).map(([langName, keysCount]) => (
                    <Table.TCell key={keysCount}>
                      <div>
                        <Link
                          to={{
                            pathname: `projects/${project.id}`,
                            search: `?keyType=${KeyTypeEnum.UNTRANSLATED}&langId=${getLangIdByName(langName)}`,
                          }}
                        >
                          {keysCount}
                        </Link>
                      </div>
                    </Table.TCell>
                  )) as unknown as ReactElement<TCellProps, typeof TCell>
                }

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
