import { Table } from '@alfalab/core-components-table';
import { Log } from 'entities';
import moment from 'moment';

type Props = {
  logs: Log[];
};

export const HistoryList = (props: Props) => {
  const { logs } = props;

  return (
    <Table>
      <Table.THead>
        <Table.THeadCell>Новое значение</Table.THeadCell>
        <Table.THeadCell>Старое значение</Table.THeadCell>
        <Table.THeadCell>Дата изменения</Table.THeadCell>
        <Table.THeadCell>id пользователя</Table.THeadCell>
      </Table.THead>
      <Table.TBody>
        {logs.map((log) => (
          <Table.TRow key={log.timestamp}>
            <Table.TCell>
              <div>{log.newValue}</div>
            </Table.TCell>
            <Table.TCell>
              <div>{log.oldValue}</div>
            </Table.TCell>
            <Table.TCell>
              <div>{moment(log.timestamp).format('YYYY-MM-DD')}</div>
            </Table.TCell>
            <Table.TCell>
              <div>{log.userId ? log.userId : '-'}</div>
            </Table.TCell>
          </Table.TRow>
        ))}
      </Table.TBody>
    </Table>
  );
};
