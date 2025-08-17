import Dropdown from 'react-bootstrap/Dropdown';

type DropDownItem = {
  key: string;
  label: string;
}

type DropdownComponentProps = {
  items: DropDownItem[];
  selectedItem: string;
  onSelectItem: (key: any) => void;
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
                active={item.key === selectedItem}
                onClick={() => onSelectItem(item.key)}
              >
                {item.label}
              </Dropdown.Item>
            )
          })
        }
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default DropdownComponent;