import React, { useState } from 'react';
import {
  Button, Modal, Form, Label,
} from 'semantic-ui-react';
import { apiAddUser, apiEditUser } from '../../../../core/api';

export default function MemberEditAddModal(props) {
  const {
    modalData,
    open,
    close,
    onComplete,
  } = props;
  const [username, setUsername] = useState(modalData.username);
  const [enable, setEnable] = useState(modalData.enable);
  const [locked, setLocked] = useState(modalData.locked);

  const type = {
    insert: 'insert',
    edit: 'edit',
  };
  const enableOptions = [
    { key: 1, text: '啟用', value: 1 },
    { key: 0, text: '未啟用', value: 0 },
  ];
  const lockedOptions = [
    { key: 1, text: '鎖定', value: 1 },
    { key: 0, text: '未鎖定', value: 0 },
  ];

  function save() {
    if (modalData.type === type.insert) {
      const addData = {
        username,
        enable,
        locked,
      };

      apiAddUser(addData).then(() => {
        onComplete();
      });
    }

    if (modalData.type === type.edit) {
      const editData = {
        username,
        enable,
        locked,
      };

      apiEditUser(editData, modalData.id).then(() => {
        onComplete();
      });
    }
  }

  return (
    <div>
      <Modal size="large" open={open} onClose={close}>
        <Modal.Header data-testid="title" content={modalData.title} />
        <Modal.Content>
          <Form data-testid="form">
            {
              !!modalData.id && (
                <Label.Group size="huge">
                  <Label content={`id : ${modalData.id}`} />
                </Label.Group>
              )
            }
            <Form.Input
              fluid
              label="名子"
              name="username"
              placeholder="請輸入姓名"
              data-testid="username"
              defaultValue={modalData.username}
              onChange={(e, data) => setUsername(data.value)}
            />
            <Form.Select
              fluid
              name="enable"
              label="狀態"
              data-testid="enable"
              options={enableOptions}
              defaultValue={modalData.enable}
              onChange={(e, data) => setEnable(data.value)}
            />
            <Form.Select
              fluid
              name="locked"
              label="鎖定"
              data-testid="locked"
              options={lockedOptions}
              defaultValue={modalData.locked}
              onChange={(e, data) => setLocked(data.value)}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button data-testid="close" color="red" content="取消" onClick={close} />
          <Button data-testid="save" content="完成" onClick={save} primary />
        </Modal.Actions>
      </Modal>
    </div>
  );
}
