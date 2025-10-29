from app import app
from model import db, CollectionPoint, Collector, CollectionSchedule
from datetime import datetime, timedelta, UTC

with app.app_context():
    CollectionSchedule.query.delete()
    CollectionPoint.query.delete()
    Collector.query.delete()

    points = [
        CollectionPoint(name="Westlands Pickup Station", latitude=-1.264, longitude=36.812),
        CollectionPoint(name="Kilimani Waste Yard", latitude=-1.292, longitude=36.785),
        CollectionPoint(name="Karen Market", latitude=-1.326, longitude=36.720),
        CollectionPoint(name="Eastleigh Dump Site", latitude=-1.283, longitude=36.857),
        CollectionPoint(name="CBD Collection Hub", latitude=-1.286, longitude=36.817)
    ]
    db.session.add_all(points)
    db.session.commit()

    collectors = [
        Collector(latitude=-1.280, longitude=36.815),
        Collector(latitude=-1.290, longitude=36.825),
        Collector(latitude=-1.300, longitude=36.820),
    ]
    db.session.add_all(collectors)
    db.session.commit()

    schedules = [
        CollectionSchedule(
            point_id=points[0].id,
            collection_date=datetime.now(UTC) + timedelta(days=1),
            status="scheduled"
        ),
        CollectionSchedule(
            point_id=points[1].id,
            collection_date=datetime.now(UTC) + timedelta(days=2),
            status="in-progress"
        ),
        CollectionSchedule(
            point_id=points[2].id,
            collection_date=datetime.now(UTC) + timedelta(days=3),
            status="completed"
        ),
        CollectionSchedule(
            point_id=points[3].id,
            collection_date=datetime.now(UTC) + timedelta(hours=10),
            status="scheduled"
        ),
        CollectionSchedule(
            point_id=points[4].id,
            collection_date=datetime.now(UTC) + timedelta(days=1, hours=5),
            status="scheduled"
        ),
    ]
    db.session.add_all(schedules)
    db.session.commit()
