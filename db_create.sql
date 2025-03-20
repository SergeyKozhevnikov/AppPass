-- статусы заявок
create TABLE public.pass_statuses (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    s_name character varying(20)    
);
COMMENT ON TABLE public.pass_statuses IS 'Статусы';

CREATE TABLE public.pass_types (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    s_name character varying(20)
);
COMMENT ON TABLE public.pass_types IS 'Типы заявок';


-- роли
create TABLE public.roles (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    s_name character varying(20)    
);

COMMENT ON TABLE public.roles IS 'Роли';


create TABLE public.users (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    role_id integer,
    login character varying(20),
    password_cash character varying(64),
    email character varying(30),
    tab_num int,    
    surname character varying(30),
    forename character varying(30),
    patronymic character varying(30),
    birthday date,
    docum character varying(64),
    pos character varying(200),
    department character varying(200) ,
    CONSTRAINT users_roles_fk FOREIGN KEY (role_id) REFERENCES public.roles(id)    
);

COMMENT ON TABLE public.users IS 'Пользователи';

COMMENT ON COLUMN public.users.tab_num IS 'табельный';
comment on column public.users.surname is 'Фамилия';
comment on column public.users.forename is 'Имя';
comment on column public.users.patronymic is 'Отчество';
comment on column public.users.docum is 'Документ';
comment on column public.users.pos is 'Должность';
comment on column public.users.department is 'Подразделение';

-- заявки
CREATE TABLE public.passes (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    pass_type int4 NULL,
    date_create timestamp not null default now(),
    date_modified timestamp not null default now(),
    status_id int,
    author_id integer,
    is_temporary boolean,
    
    -- владелец пропуска
    person_tab_num int,-- если в штате 
    person_surname character varying(30),
    person_forename character varying(30),
    person_patronymic character varying(30),
    person_birthday date,
    person_docum character varying(64),  
    
    -- мат.ценности
    mat_in boolean,
    mat_out boolean, 
    
    --- машина ---
    car_num character varying(10),
    car_model character varying(20),
    car_color character varying(20),
    
    -- отметки выдача/возврат
    pass_give timestamp with time zone ,
    pass_return time with time zone ,
    
    CONSTRAINT passes_pass_types_fk FOREIGN KEY (pass_type) REFERENCES public.pass_types(id),
    CONSTRAINT passes_status_fk FOREIGN KEY (status_id) REFERENCES public.pass_statuses(id),
    CONSTRAINT passes_author_fk FOREIGN KEY (author_id) REFERENCES public.users(id)
);

COMMENT ON TABLE public.passes IS 'Заявки на пропуск';

comment on column public.passes.author_id is 'Автор заявки';
comment on column public.passes.is_temporary is 'Если временный';
comment on column public.passes.person_tab_num is 'Таб.№, если на сотрудника';
comment on column public.passes.person_surname is 'Фамилия';
comment on column public.passes.person_forename is 'Имя';
comment on column public.passes.person_patronymic is 'Отчество';
comment on column public.passes.person_docum is 'Документ';
COMMENT ON COLUMN public.passes.pass_give IS 'Время выдачи пропуска';
COMMENT ON COLUMN public.passes.pass_return IS 'Время возврата пропуска';
COMMENT ON COLUMN public.passes.mat_in IS 'Мат.ценности на внос';
COMMENT ON COLUMN public.passes.mat_out IS 'Мат.ценности на вынос';

-- материальные ценности в заявке
CREATE TABLE public.materials (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    pass_id integer,
    mat_name character varying(30),
    mat_num character varying(20),
    ed_izm character varying(10),
    quantity real ,
    CONSTRAINT materials_passes_fk FOREIGN KEY (pass_id) REFERENCES public.passes(id) ON DELETE CASCADE
);
COMMENT ON TABLE public.materials IS 'Материальные ценности в заявке';

comment on column public.materials.mat_num is 'Серийный номер';
comment on column public.materials.ed_izm is 'Единицы измерения';
comment on column public.materials.quantity is 'Количество';


-- согласующие заявок
CREATE TABLE public.concordants (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    pass_id integer NOT NULL,
    user_id integer NOT NULL,
    review_deadline date,
    review_fact timestamp,
    accepted boolean,
    s_comment text,
    CONSTRAINT concordants_passes_fk FOREIGN KEY (pass_id) REFERENCES public.passes(id) ON DELETE CASCADE,
    CONSTRAINT concordants_users_fk FOREIGN KEY (user_id) REFERENCES public.users(id)
);
COMMENT ON TABLE public.concordants IS 'Согласующие заявок';

comment on column public.concordants.review_deadline is 'Срок согласования';
comment on column public.concordants.review_fact is 'Дата рассмотрения';
comment on column public.concordants.accepted is 'Согласовано';




