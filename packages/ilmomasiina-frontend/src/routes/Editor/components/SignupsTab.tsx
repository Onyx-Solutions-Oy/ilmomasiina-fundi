import React, { useMemo } from 'react';

import { Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import {
  convertSignupsToCSV,
  FormattedSignup,
  getSignupsForAdminList,
  stringifyAnswer,
} from '@tietokilta/ilmomasiina-components/dist/utils/signupUtils';
import useEvent from '@tietokilta/ilmomasiina-components/dist/utils/useEvent';
import { deleteSignup, getEvent, resendConfirmationEmails } from '../../../modules/editor/actions';
import { useTypedDispatch, useTypedSelector } from '../../../store/reducers';
import CSVLink, { CSVOptions } from './CSVLink';

import '../Editor.scss';

type SignupProps = {
  position: number;
  signup: FormattedSignup;
};

const SignupRow = ({ position, signup }: SignupProps) => {
  const event = useTypedSelector((state) => state.editor.event)!;
  const dispatch = useTypedDispatch();
  const { t } = useTranslation();

  const onDelete = useEvent(async () => {
    const confirmation = window.confirm(
      t('editor.signups.action.delete.confirm'),
    );
    if (confirmation) {
      await dispatch(deleteSignup(signup.id!));
      dispatch(getEvent(event.id));
    }
  });

  const nameEmailCols = (event.nameQuestion ? 2 : 0) + (event.emailQuestion ? 1 : 0);

  return (
    <tr className={!signup.confirmed ? 'text-muted' : ''}>
      <td>
        <input name="action-box" type="checkbox" id={signup.id} />
      </td>
      <td key="position">{`${position}.`}</td>
      {signup.confirmed && event.nameQuestion && (
        <td key="firstName">{signup.firstName}</td>
      )}
      {signup.confirmed && event.nameQuestion && (
        <td key="lastName">{signup.lastName}</td>
      )}
      {signup.confirmed && event.emailQuestion && (
        <td key="email">{signup.email}</td>
      )}
      {!signup.confirmed && nameEmailCols && (
        <td colSpan={nameEmailCols} className="font-italic">
          {t('editor.signups.unconfirmed')}
        </td>
      )}
      <td key="quota">{signup.quota}</td>
      {event.questions.map((question) => (
        <td key={question.id}>
          {stringifyAnswer(signup.answers[question.id])}
        </td>
      ))}
      <td key="timestamp">{signup.createdAt}</td>
      <td key="delete">
        <Button type="button" variant="danger" onClick={onDelete}>
          {t('editor.signups.action.delete')}
        </Button>
      </td>
    </tr>
  );
};

const csvOptions: CSVOptions = { delimiter: '\t' };

const SignupsTab = () => {
  const dispatch = useTypedDispatch();

  const event = useTypedSelector((state) => state.editor.event);

  const { t } = useTranslation();

  const bodyRef = React.createRef<HTMLTableSectionElement>();

  const onMassAction = useEvent(async () => {
    const confirmation = window.confirm(
      t('editor.signups.action.resendConfirmaton'),
    );
    if (confirmation) {
      const ids = Array.from(
        bodyRef.current!.querySelectorAll('input[name="action-box"]:checked'),
      ).map((el) => el.id);

      if (ids.length === 0) {
        toast.error(t('editor.signups.action.noSelection'));
        return;
      }

      toast.promise(
        dispatch(resendConfirmationEmails(ids)),
        {
          pending: t('editor.signups.action.resendConfirmaton.pending'),
          success: t('editor.signups.action.resendConfirmaton.success'),
          error: t('editor.signups.action.resendConfirmaton.error'),
        },
      );
    }
  });

  const signups = useMemo(
    () => event && getSignupsForAdminList(event),
    [event],
  );

  const csvSignups = useMemo(
    () => event && convertSignupsToCSV(event, signups!),
    [event, signups],
  );

  if (!event || !signups?.length) {
    return <p>{t('editor.signups.noSignups')}</p>;
  }

  return (
    <div>
      <CSVLink
        data={csvSignups!}
        csvOptions={csvOptions}
        download={t('editor.signups.download.filename', {
          event: event.title,
        })}
      >
        {t('editor.signups.download')}
      </CSVLink>
      <br />
      <br />
      <Form.Group>
        <h3>{t('editor.signups.actions')}</h3>
        <Form.Control as="select">
          <option>{t('editor.signups.action.resendConfirmaton')}</option>
        </Form.Control>
        <br />
        <Button type="button" onClick={onMassAction}>{t('editor.signups.execute')}</Button>
      </Form.Group>
      <br />
      <br />
      <table className="event-editor--signup-table table table-condensed table-responsive">
        <thead>
          <tr className="active">
            <th>{}</th>
            <th key="position">#</th>
            {event.nameQuestion && (
              <th key="firstName">{t('editor.signups.column.firstName')}</th>
            )}
            {event.nameQuestion && (
              <th key="lastName">{t('editor.signups.column.lastName')}</th>
            )}
            {event.emailQuestion && (
              <th key="email">{t('editor.signups.column.email')}</th>
            )}
            <th key="quota">{t('editor.signups.column.quota')}</th>
            {event.questions.map((q) => (
              <th key={q.id}>{q.question}</th>
            ))}
            <th key="timestamp">{t('editor.signups.column.time')}</th>
            <th key="delete" aria-label={t('editor.signups.column.delete')} />
          </tr>
        </thead>
        <tbody ref={bodyRef}>
          {signups.map((signup, index) => (
            <SignupRow key={signup.id} position={index + 1} signup={signup} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SignupsTab;
