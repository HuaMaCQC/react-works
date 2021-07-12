import React, { useState, useEffect, useReducer } from 'react';
import {
  Table, Pagination, Grid, Form, Icon, Button,
} from 'semantic-ui-react';
import { DateTimeInput } from 'semantic-ui-calendar-react';
import moment from 'moment';
import styles from './MemberList.styledJsx.scss';
import { apiGetUser, apiDeleteUser } from '../../../core/api';
import MemberEditAddModal from './MemberListModal/MemberEditAddModal';
import createCsvFile from '../../../public/CreateCsvFile';

const initfindData = {
  username: undefined,
  enable: undefined,
  locked: undefined,
  start_created_at: undefined,
  end_created_at: undefined,
  max_results: 5,
  first_result: 0,
};

function handleFindChange(state, { findData, name, value }) {
  let v = value;

  if (name === 'start_created_at' || name === 'end_created_at') {
    v = value === '' ? '' : moment(value).format();
  }

  return { ...findData || state, [name]: v === '' ? undefined : v };
}

export default function MemberList() {
  const [memberData, setMemberData] = useState([]);
  const [findData, setFindData] = useReducer(handleFindChange, initfindData);
  const [csv, setCsv] = useState({ url: '', fileName: '' });
  const [pagination, setPagination] = useState(
    {
      nowActivePage: 1,
      totalPages: 0,
      total: 0,
    },
  );
  const [modalData, setModalData] = useState(
    {
      id: undefined,
      username: undefined,
      enable: 1,
      locked: 0,
      title: '',
      type: '',
    },
  );
  const [open, setOpen] = useState(false);
  const [startCreatedAt, setStartCreatedAt] = useState(undefined);
  const [endCreatedAt, setEndCreatedAt] = useState(undefined);
  const type = { insert: 'insert', edit: 'edit' };
  const {
    nowActivePage,
    totalPages,
  } = pagination;
  const enableOptions = [
    { key: '-1', text: '全部', value: undefined },
    { key: '1', text: '啟用', value: 1 },
    { key: '0', text: '未啟用', value: 0 },
  ];
  const lockedOptions = [
    { key: '-1', text: '全部', value: undefined },
    { key: '1', text: '鎖定', value: 1 },
    { key: '0', text: '未鎖定', value: 0 },
  ];
  const jsxId = (() => {
    const jsx = <scope><style jsx>{styles}</style></scope>;
    return jsx.props.className;
  })();

  function getUser(newFindData) {
    apiGetUser(newFindData).then((res) => {
      const maxResults = Number(res.data.pagination.max_results);
      const total = Number(res.data.pagination.total);
      const newActivePage = Math.ceil(Number(res.data.pagination.first_result) / maxResults + 1);

      setMemberData(res.data.ret);
      setPagination(
        {
          total,
          nowActivePage: newActivePage,
          totalPages: Math.ceil(total / maxResults),
        },
      );
    });
  }

  // eslint-disable-next-line
  useEffect(() => { getUser(findData); }, []);

  function search() {
    const nextFindData = {
      ...findData,
      first_result: 0,
    };

    setFindData({ findData: nextFindData });
    getUser(nextFindData);
  }

  function handlePaginationChange({ activePage }) {
    const nextFindData = {
      ...findData,
      first_result: (activePage - 1) * findData.max_results,
    };

    setFindData({ findData: nextFindData });
    getUser(nextFindData);
  }

  function openModal(opentype, data) {
    if (opentype === type.insert) {
      setModalData({
        type: type.insert,
        id: 0,
        username: '',
        enable: 1,
        locked: 0,
        title: '新增',
      });
    }

    if (opentype === type.edit) {
      setModalData({
        type: type.edit,
        id: data.id,
        username: data.username || '',
        enable: data.enable === undefined ? 0 : data.enable,
        locked: data.locked === undefined ? 1 : data.locked,
        title: '修改',
      });
    }

    setOpen(true);
  }

  function close() {
    setOpen(false);
  }

  function onComplete() {
    getUser(findData);
    close();
  }

  function del(e) {
    const { id } = e.currentTarget.dataset;
    apiDeleteUser(id).then(() => {
      getUser(findData);
    });
  }

  function changeSearchStartTime(e, data) {
    setStartCreatedAt(data.value);
    setFindData(data);
  }

  function changeSearchEndTime(e, data) {
    setEndCreatedAt(data.value);
    setFindData(data);
  }

  function exportCsv() {
    const data = memberData.reduce((accumulator, value) => {
      accumulator.push([
        value.id,
        value.username,
        value.enable ? '啟動' : '未啟動',
        value.locked ? '鎖定' : '未鎖定',
        moment(value.created_at).format('YYYY-MM-DD hh:mm:ss'),
      ]);

      return accumulator;
    }, [['id', '姓名', '狀態', '鎖定', '創建時間']]);

    const myCsv = createCsvFile(data);

    setCsv({ url: myCsv, fileName: '會員資料.csv' });
  }

  return (
    <div className="member-list">
      <Grid columns={1}>
        <Grid.Column className={`${jsxId} grid-card`}>
          <Form>
            <Form.Group widths="equal">
              <Form.Input
                fluid
                label="姓名"
                placeholder="請輸入姓名"
                name="username"
                data-testid="search-username"
                onChange={(e, data) => setFindData(data)}
              />
              <Form.Select
                fluid
                name="enable"
                label="狀態"
                data-testid="search-enable"
                options={enableOptions}
                placeholder={enableOptions[0].text}
                onChange={(e, data) => setFindData(data)}
              />
              <Form.Select
                fluid
                name="locked"
                label="鎖定"
                data-testid="search-locked"
                options={lockedOptions}
                placeholder={enableOptions[0].text}
                onChange={(e, data) => setFindData(data)}
              />
            </Form.Group>
            <Form.Group inline>
              查詢時間
              <DateTimeInput
                clearable
                closable
                name="start_created_at"
                animation="none"
                placeholder="全部時間"
                popupPosition="bottom left"
                dateTimeFormat="YYYY-MM-DD hh:mm:ss"
                data-testid="search-start_created_at"
                value={startCreatedAt}
                clearIcon={<Icon name="remove" />}
                onChange={changeSearchStartTime}
              />
              ~
              <DateTimeInput
                clearable
                closable
                name="end_created_at"
                animation="none"
                placeholder="全部時間"
                dateTimeFormat="YYYY-MM-DD hh:mm:ss"
                data-testid="search-end_created_at"
                popupPosition="bottom left"
                value={endCreatedAt}
                clearIcon={<Icon name="remove" />}
                onChange={changeSearchEndTime}
              />
            </Form.Group>
            <Form.Group className={`${jsxId} float-right`}>
              <Form.Button onClick={search} data-testid="search-btn" content="查詢" />
            </Form.Group>
          </Form>
        </Grid.Column>
        <Grid.Column className={`${jsxId} grid-content`}>
          <Table celled>
            <Table.Header data-testid="table-header">
              <Table.Row>
                <Table.HeaderCell content="ID" />
                <Table.HeaderCell content="姓名" />
                <Table.HeaderCell content="狀態" />
                <Table.HeaderCell content="鎖定" />
                <Table.HeaderCell content="創建時間" />
                <Table.HeaderCell content="操作" />
              </Table.Row>
            </Table.Header>
            <Table.Body data-testid="table-list">
              {
                memberData.map(data => (
                  <Table.Row key={data.id}>
                    <Table.Cell content={data.id} />
                    <Table.Cell content={data.username} />
                    <Table.Cell
                      className={`${jsxId} ${data.enable ? 'member-not-lock' : 'member-lock'}`}
                      content={data.enable ? '啟動' : '未啟動'}
                    />
                    <Table.Cell className={`${jsxId} ${data.locked ? 'member-lock' : 'member-not-lock'}`}>
                      <Icon name={data.locked ? 'lock' : 'lock open'} />
                      {data.locked ? '鎖定' : '未鎖定'}
                    </Table.Cell>
                    <Table.Cell content={moment(data.created_at).format('YYYY-MM-DD hh:mm:ss')} />
                    <Table.Cell>
                      <Button
                        content="編輯"
                        onClick={() => openModal(type.edit, data)}
                      />
                      <Button
                        content="刪除"
                        data-id={data.id}
                        onClick={del}
                      />
                    </Table.Cell>
                  </Table.Row>
                ))
              }
            </Table.Body>
            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell colSpan="5">
                  <Pagination
                    size="mini"
                    siblingRange="2"
                    data-testid="table-pagination"
                    activePage={nowActivePage}
                    totalPages={totalPages}
                    onPageChange={(e, data) => handlePaginationChange(data)}
                  />
                </Table.HeaderCell>
                <Table.HeaderCell colSpan="1">
                  <Button data-testid="member-add" onClick={() => openModal(type.insert)} content="新增" />
                  <Button
                    as="a"
                    data-testid="export-csv"
                    content="匯出"
                    href={csv.url}
                    download={csv.fileName}
                    onClick={exportCsv}
                  />
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        </Grid.Column>
      </Grid>
      <MemberEditAddModal
        modalData={modalData}
        close={close}
        open={open}
        onComplete={onComplete}
      />
      <style jsx="true">{styles}</style>
    </div>
  );
}
