import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation, useParams } from 'react-router';
import { Table } from '@alfalab/core-components-table';
import { Collapse } from '@alfalab/core-components-collapse';

import { Preloader, Btn, Select } from 'mcn-ui-components';
import { buildFilterQuery } from 'mcn-ui-components/utils';

import { Navbar } from 'widgets';
import { ConcatFilterDelimitersEnum, KeyTypeEnum } from 'shared/types';
import { DEFAULT_CURRENT_PAGE, DEFAULT_LIMIT_PER_PAGE, TranslatorInput, concatFiltersWithDelimiter } from 'shared';
import { Lang, Project, useKeyStore, useLangStore, useProjectStore } from 'entities';
import { CreateKeyModal, UpdateKeyForm, UpdateCommentForm, HistoryList } from 'features';

import { Params } from './types';
import { DEFAULT_PRODUCT_SEARCH_FIELDS_SELECT_OPTIONS, PRODUCT_SEARCH_FIELDS_SELECT_OPTIONS } from './utils';


import styles from './Product.module.scss';

export const ProductPage = () => {
  const { projectId } = useParams<Params>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyType = searchParams.get('keyType');
  const langId = searchParams.get('langId');

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
  const [langValue, setLangValue] = useState(+langId);
  const [searchValue, setSearchValue] = useState('');
  const [searchFieldOptions, setSearchFieldOptions] = useState(DEFAULT_PRODUCT_SEARCH_FIELDS_SELECT_OPTIONS);
  const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE);
  const [limitPerPage, setLimitPerPage] = useState(DEFAULT_LIMIT_PER_PAGE);

  const DATA_SIZE = keys?.totalCount;
  const pagesCount = Math.ceil(DATA_SIZE / limitPerPage);

  const handleCurrentPageChange = (pageIndex: number) => setCurrentPage(pageIndex);
  const handleLimitPerPageChange = (perPage: number) => setLimitPerPage(perPage);

  const commonFilters = useMemo(() => [
    ...(projectId ? [buildFilterQuery('projectId', '$eq', [projectId])] : []),
    ...(langValue ? [buildFilterQuery('langId', '$eq', [langValue])] : []),
    ...(keyType === KeyTypeEnum.UNTRANSLATED ? [buildFilterQuery('name', '$eq', '$value')] : []),
  ], [searchValue, currentPage, langValue, projectId, limitPerPage]);

  const searchFilters = useMemo(() => {
    if (!searchFieldOptions || !searchValue) {
      return [];
    }

    return searchFieldOptions.map((field) => buildFilterQuery(field.value, '$ILike', searchValue));
  }, [searchFieldOptions, searchValue]);

  const getKeysParams = useMemo(
    () => ({
      limit: limitPerPage,
      offset: searchValue.length ? 0 : limitPerPage * currentPage,
      filter: concatFiltersWithDelimiter(searchFilters, ConcatFilterDelimitersEnum.OR, commonFilters),
    }),
    [limitPerPage, currentPage, searchValue, searchFilters, commonFilters],
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

  const handleChangeSelect = (event: SelectEvent<DefaultSelectOption<string, number>>) => {
    setLangValue(event.data.value);
  };

  const handleChangeSearchField = (event: SelectEvent<DefaultSelectOption<string, string>[]>) => {
    setSearchFieldOptions(event.data);
  };

  const handleChangeSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!searchFieldOptions.length) {
      setSearchFieldOptions(DEFAULT_PRODUCT_SEARCH_FIELDS_SELECT_OPTIONS)
    }

    setSearchValue(event.target.value);
  }

  const pageTitle = !projectId ? 'Все ключи' : currentProduct?.name;

  return (
    <div className={styles.page}>
      <Navbar />
      {(isLoadingKeys || isLoadingLangs || isLoadingProjects) && <Preloader typeStyle='base' />}
      <div className={styles.header}>
        <div className={styles.headerItemProject}>
          <Link to='/projects'>
            <div>{pageTitle?.toUpperCase()}</div>
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
            value={langSelectOptions.find((el) => el.value === langValue) || langSelectOptions[0]}
            name='lang'
            onChange={handleChangeSelect}
          />
        </div>
        <div className={styles.headerItem}>
          <Select
            isMulti
            isSearchable={false}
            closeMenuOnSelect={false}
            placeholder='Поле'
            typeStyle='base'
            value={searchFieldOptions}
            options={Object.values(PRODUCT_SEARCH_FIELDS_SELECT_OPTIONS)}
            name='lang'
            onChange={handleChangeSearchField}
          />
        </div>
        <div className={styles.headerItem}>
          <TranslatorInput
            placeholder='Поиск'
            onChange={handleChangeSearchInput}
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
