import React from 'react';
import { Label, Icon } from 'semantic-ui-react';
import styles from './AppHeader.styledJsx.scss';

function resolveScopedStyles(scope) {
  return scope.props.className;
}

export default function AppHeader(props) {
  const { switchMenu, user } = props;
  const jsxId = resolveScopedStyles(
    <scope>
      <style jsx>{styles}</style>
    </scope>,
  );

  return (
    <div className="header">
      <div className="menu-icon">
        <Icon data-testid="switchMenu" link name="sidebar" size="big" onClick={switchMenu} />
      </div>
      <span className="title">管理系統</span>
      <div className="user">
        <div className="notify-bar">
          <Label as="a" size="mini" className={`${jsxId} header-bnt`}>
            <Icon size="large" name="envelope" />
            信件
            <Label circular color="red" className={`${jsxId} user-floating`} floating>
              22
            </Label>
          </Label>
          <Label as="a" size="mini" className={`${jsxId} header-bnt`}>
            <Icon size="large" name="comment" />
            訊息
            <Label circular color="red" className={`${jsxId} user-floating`} floating>
              6
            </Label>
          </Label>
        </div>
        <span className="user-title">歡迎:</span>
        <Label as="a" size="large" className={`${jsxId} header-bnt`}>
          <Icon size="large" name="user circle" />
          {user.name}
        </Label>
      </div>
      <style jsx="true">{styles}</style>
    </div>
  );
}
