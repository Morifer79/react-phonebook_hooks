import { useState, useEffect, useMemo } from 'react';
import { nanoid } from 'nanoid';
import { Container, Title } from './App.styled';
import { ContactForm } from './ContactForm/ContactForm';
import { ContactList } from './ContactList/ContactList';
import { Filter } from './Filter/Filter';
import { Notification } from './Notification/Notification';

const getInitialContacts = () => {
  const parsedContacts = localStorage.getItem('contacts');
  if (parsedContacts !== null) {
    return JSON.parse(parsedContacts);
  }
  return [];
};

export const App = () => {
  const [contacts, setContacts] = useState(getInitialContacts);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  const addNewContact = ({ name, number }) => {
    const isExistsContact = contacts.some(
      contact => contact.name.toLowerCase() === name.toLowerCase()
    );

    if (isExistsContact) {
      alert(`${name} is already in contacts`);
      return;
    }

    setContacts(prevContacts => [
      ...prevContacts,
      { id: nanoid(), name, number },
    ]);
  };

	const changeFilter = e => setFilter(e.target.value);
	
  const existsContacts = useMemo(() => {
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(filter)
    );
  }, [filter, contacts]);

  const delContact = contactId => {
    setContacts(prevContacts =>
      prevContacts.filter(({ id }) => id !== contactId)
    );
  };

  return (
    <Container>
      <Title title="Phonebook" />
      <ContactForm newContact={addNewContact} />

      <Title title="Contacts" />
      {contacts.length > 0 ? (
        <Filter value={filter} onChange={changeFilter} />
      ) : (
        <Notification message="You don't have any contacts!" />
      )}
      {contacts.length > 0 && (
        <ContactList contacts={existsContacts} onDelContact={delContact} />
      )}
    </Container>
  );
};
