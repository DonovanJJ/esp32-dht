import Dropdown from 'react-bootstrap/Dropdown';

type DropdownComponentProps = {
  items: string[];
  selectedItem: string;
  onSelectItem: (item: string) => void;
};

function DropdownComponent({ items, selectedItem, onSelectItem }: DropdownComponentProps) {

  return (
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        {selectedItem ? selectedItem : "Select a device"}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {
          items.map((item, idx) => {
            return (
              <Dropdown.Item
                key={idx}
                active={item === selectedItem}
                onClick={() => onSelectItem(item)}
              >
                {item}
              </Dropdown.Item>
            )
          })
        }
        {/*<Dropdown.Item href="#/action-1">Action</Dropdown.Item>*/}
        {/*<Dropdown.Item href="#/action-2">Another action</Dropdown.Item>*/}
        {/*<Dropdown.Item href="#/action-3">Something else</Dropdown.Item>*/}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default DropdownComponent;