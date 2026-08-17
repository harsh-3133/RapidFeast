import psycopg2
from psycopg2.extras import RealDictCursor

DATABASE_URL = "postgresql://neondb_owner:npg_XA5iZTPMC6fn@ep-odd-wildflower-ay6mj0g8.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require"

def get_db_connection():
    conn = psycopg2.connect(
        DATABASE_URL,
        cursor_factory=RealDictCursor
    )
    return conn
