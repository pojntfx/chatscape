import {
  Avatar,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  List,
  ListItem,
  Skeleton,
} from "@patternfly/react-core";

export const ContactList = ({
  contacts,
  contactList,
  width,
  activeContactID,
  setActiveContactID,
  setDrawerExpanded,
}: {
  contacts: {
    id: string;
    avatar: string;
    name: string;
    intro: string;
  }[];
  contactList: {
    id: string;
    avatar: string;
    name: string;
    intro: string;
  }[];
  width?: number;
  activeContactID: string | null;
  setActiveContactID: (id: string) => void;
  setDrawerExpanded: (expanded: boolean) => void;
}) => (
  <List isPlain>
    {contacts.length > 0 ? (
      contactList && contactList.length > 0 ? (
        contactList.map((contact, i) => (
          <ListItem key={i}>
            <Button
              variant="plain"
              className="pf-u-display-flex pf-u-align-items-center pf-u-p-md pf-u-contact-selector pf-u-w-100"
              isActive={contact.id === activeContactID}
              onClick={() => {
                setActiveContactID(contact.id);

                if (!(!width || width >= 768)) {
                  setDrawerExpanded(false);
                }
              }}
            >
              <Avatar
                src={contact.avatar}
                alt="avatar"
                className="pf-u-mr-md"
              />

              <div className="pf-u-display-flex pf-u-flex-direction-column pf-u-align-items-flex-start pf-u-justify-content-center">
                <div className="pf-u-font-family-heading-sans-serif">
                  {contact.name}
                </div>

                <div className="pf-u-icon-color-light">{contact.intro} ...</div>
              </div>
            </Button>
          </ListItem>
        ))
      ) : (
        <ListItem>
          <EmptyState variant={EmptyStateVariant.xs}>
            <EmptyStateBody>No contacts found</EmptyStateBody>
          </EmptyState>
        </ListItem>
      )
    ) : (
      [0, 1, 2].map((_, i) => (
        <ListItem key={i}>
          <Button
            variant="plain"
            className="pf-u-display-flex pf-u-align-items-center pf-u-p-md pf-u-contact-selector pf-u-w-100"
            disabled
          >
            <Skeleton
              shape="circle"
              width="36px"
              height="36px"
              screenreaderText="Loading avatar"
              className="pf-u-mr-md"
            />
            <div className="pf-u-display-flex pf-u-flex-direction-column pf-u-align-items-flex-start pf-u-justify-content-center pf-u-flex-1">
              <div className="pf-u-font-family-heading-sans-serif pf-u-w-100 pf-u-pb-sm">
                <Skeleton
                  screenreaderText="Loading contact info"
                  width={(i % 2 !== 0 ? 33 : 66) + (i % 2) * 10 + "%"}
                />
              </div>
              <div className="pf-u-icon-color-light pf-u-w-100">
                <Skeleton
                  screenreaderText="Loading contact info"
                  width={(i % 2 === 0 ? 33 : 66) + (i % 2) * 10 + "%"}
                />
              </div>
            </div>
          </Button>
        </ListItem>
      ))
    )}
  </List>
);
