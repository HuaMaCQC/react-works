import React, { useState } from 'react';
import { Accordion, Icon, Menu } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import styles from './AppMenu.styledJsx.scss';

function activeUr(selected, id) {
  const actives = [...selected];
  const idx = actives.indexOf(id);

  if (idx === -1) {
    actives.push(id);
  }

  if (idx !== -1) {
    actives.splice(idx, 1);
  }

  return actives;
}

export default function AppMenu(props) {
  const { menu } = props;
  const [selected, setSelected] = useState([]);

  return (
    <div className="menu">
      <Accordion>
        {
          menu.map(item => (
            <div className="menu-item" key={item.id}>
              <Accordion.Title
                index={0}
                data-id={item.id}
                onClick={() => setSelected(activeUr(selected, item.id))}
                active={selected.indexOf(item.id) !== -1}
                data-testid="title"
              >
                {item.name}
                <div className="icon"><Icon name="dropdown" /></div>
              </Accordion.Title>
              <Accordion.Content data-testid="content" active={selected.indexOf(item.id) !== -1}>
                <Menu text vertical>
                  <div className="menu-content">
                    {
                      item.option.map(option => (
                        <Menu.Item
                          key={option.id}
                          name={option.name}
                          as={NavLink}
                          to={option.path}
                        />
                      ))
                    }
                  </div>
                </Menu>
              </Accordion.Content>
            </div>
          ))
        }
      </Accordion>
      <style jsx="true">{styles}</style>
    </div>
  );
}
