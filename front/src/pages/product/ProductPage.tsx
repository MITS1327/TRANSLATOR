import { Preloader, Btn, Select } from 'mcn-ui-components';
import { buildFilterQuery } from 'mcn-ui-components/utils';
import { useParams } from 'react-router';
import { Table } from '@alfalab/core-components-table';
import { Collapse } from '@alfalab/core-components-collapse';
import { CreateKeyModal, UpdateKeyForm, UpdateCommentForm, HistoryList } from 'features';
import { Lang, Project, useKeyStore, useLangStore, useProjectStore } from 'entities';
import { useEffect, useMemo, useState } from 'react';
import { TranslatorInput } from 'shared';
import { Link } from 'react-router-dom';
import { Navbar } from 'widgets/index';

import styles from './Product.module.scss';

export const ProductPage = () => {
  const { projectId } = useParams<QueryParams>();

  const [search, setSearch] = useState('');

  const getKeys = useKeyStore((state) => state.getKeys);
  const keys = useKeyStore((state) => state.keys);
  const products = useProjectStore((state) => state.projects);
  const getProducts = useProjectStore((state) => state.getProjects);
  const langs = useLangStore((state) => state.langs);
  const getLangs = useLangStore((state) => state.getLangs);
  const isLoadingKeys = useKeyStore((state) => state.isLoading);
  const isLoadingProjects = useProjectStore((state) => state.isLoading);
  const isLoadingLangs = useLangStore((state) => state.isLoading);
  const [isOpen, setIsOpen] = useState(false);
  const [langValue, setLangValue] = useState(null);

  const [searchField, setSearchField] = useState('name');

  const DATA_SIZE = keys?.totalCount;
  const PER_PAGE = 20;
  const [page, setPage] = useState(0);
  const handlePageChange = (pageIndex: number) => setPage(pageIndex);
  const pagesCount = Math.ceil(DATA_SIZE / PER_PAGE);

  const getKeysParams = useMemo(
    () => ({
      limit: PER_PAGE,
      offset: search.length ? 0 : PER_PAGE * page,
      filter: [
        projectId ? buildFilterQuery('projectId', '$eq', [projectId]) : null,
        buildFilterQuery(searchField, '$like', [search]),
        langValue ? buildFilterQuery('langId', '$eq', [langValue]) : null,
      ],
    }),
    [search, page, langValue, searchField],
  );

  const searchFieldSelectOptions = useMemo(
    () => [
      {
        label: 'Название',
        value: 'name',
      },
      {
        label: 'Значение',
        value: 'value',
      },
      {
        label: 'Комментарий',
        value: 'comment',
      },
    ],
    [],
  );

  useEffect(() => {
    getKeys(getKeysParams);
  }, [getKeysParams]);

  useEffect(() => {
    getLangs();
  }, []);

  useEffect(() => {
    getProducts();
  }, []);

  const currentProduct = useMemo(() => products?.data.find((el: Project) => el.id === +projectId), [products]);

  const langSelectOptions = useMemo(() => {
    const selectOptions = langs?.data.map((el) => ({ label: el.name, value: el.id })) || [];

    selectOptions.unshift({
      label: 'Не выбрано',
      value: null,
    });

    return selectOptions;
  }, [langs]);

  const getCurrentLang = (langId: number) => {
    return langs?.data.find((el: Lang) => el.id === langId)?.name;
  };

  const handleChangeSelect = (data: { name: string; data: { label: string; value: number } }) => {
    setLangValue(data?.data.value);
  };

  const handleChangeSearchField = (data: { name: string; data: { label: string; value: string } }) => {
    setSearchField(data?.data.value);
  };

  const pageTitle = !projectId ? 'Все ключи' : currentProduct?.name;

  return (
    <div className={styles.page}>
      <Navbar />
      {(isLoadingKeys || isLoadingLangs || isLoadingProjects) && <Preloader typeStyle='base' />}
      <div className={styles.header}>
        <div className={styles.headerItemProject}>
          <Link to='/projects'>
            <div>{pageTitle.toUpperCase()}</div>
          </Link>
        </div>
        <Btn className={styles.headerItem} onClick={() => setIsOpen(true)} kind='base'>
          Добавить ключ
        </Btn>
        <div className={styles.headerItem}>
          <Select
            placeholder='Язык'
            typeStyle='base'
            options={langSelectOptions}
            value={langSelectOptions[0]}
            name='lang'
            onChange={handleChangeSelect}
          />
        </div>
        <div className={styles.headerItem}>
          <Select
            placeholder='Поле'
            typeStyle='base'
            value={searchFieldSelectOptions[0]}
            options={searchFieldSelectOptions}
            name='lang'
            onChange={handleChangeSearchField}
          />
        </div>
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
              perPage={PER_PAGE}
              currentPageIndex={page}
              pagesCount={pagesCount}
              onPageChange={handlePageChange}
            />
          }
        >
          <Table.THead>
            <Table.THeadCell width={100}>Ключ</Table.THeadCell>
            <Table.THeadCell width={100}>Язык</Table.THeadCell>
            <Table.THeadCell width={200} textAlign='center'>
              Значение
            </Table.THeadCell>
            <Table.THeadCell width={200} textAlign='center'>
              Комментарий
            </Table.THeadCell>
          </Table.THead>
          <Table.TBody>
            {keys?.data.map((key) => (
              <Table.TExpandableRow
                key={key.id}
                renderContent={(expanded) => (
                  <>
                    <Table.TCell colSpan={1} />
                    <Table.TCell colSpan={1} />
                    <Collapse expanded={expanded}>
                      <div>
                        <HistoryList logs={key.logs} />
                      </div>
                    </Collapse>
                  </>
                )}
              >
                <Table.TCell>
                  <div>{key.name}</div>
                </Table.TCell>

                <Table.TCell>
                  <div>{getCurrentLang(key.langId)}</div>
                </Table.TCell>

                <Table.TCell>
                  <UpdateKeyForm keyId={key.id} getKeysParams={getKeysParams} initialValue={key.value} />
                </Table.TCell>

                <Table.TCell>
                  <UpdateCommentForm
                    name={key.name}
                    getKeysParams={getKeysParams}
                    productId={projectId}
                    initialValue={key.comment}
                  />
                </Table.TCell>
              </Table.TExpandableRow>
            ))}
          </Table.TBody>
        </Table>
      </div>
      <CreateKeyModal isOpen={isOpen} projectId={projectId} toggle={setIsOpen} />
    </div>
  );
};
